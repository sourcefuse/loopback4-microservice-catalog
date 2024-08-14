pipeline {
    parameters{
        gitParameter(
            name: 'GIT_TAG_OR_BRANCH',
            description: 'Choose either branch or tag name to build from',
            type: 'PT_BRANCH_TAG',
            quickFilterEnabled: true,
            selectedValue: 'DEFAULT',
            defaultValue: params.GIT_TAG_OR_BRANCH ?: 'origin/dev',
            listSize: '1'
        )
        string(
            name: 'AGENT',
            defaultValue: params.AGENT ?: '<%= project %>-qa-slave',
            description: 'agent to run the build on'
        )
        string(
            name: 'BUILD_ENV',
            defaultValue: params.BUILD_ENV ?: 'dev',
            description: 'environment to build for'
        )
        booleanParam(name: "FULL_BUILD", defaultValue: params.FULL_BUILD ?: false, description: 'Is this the first time build?')
        booleanParam(name: "RUN_SONAR_CHECKS", defaultValue: params.RUN_SONAR_CHECKS ?: false, description: 'Do you want to run Sonar analysis ?')
        booleanParam(name: "RUN_SNYK_CHECKS", defaultValue: params.RUN_SNYK_CHECKS ?: false, description: 'Do you want to run Snyk analysis ?')
        booleanParam(name: "RUN_UNIT_TESTS", defaultValue: params.RUN_UNIT_TESTS ?: false, description: 'Do you want to run unit tests ?')
        booleanParam(name: "BUILD_NEEDED", defaultValue: true, description: 'Do you want to build docker images?')
        booleanParam(name: "RELEASE_NEEDED", defaultValue: true, description: 'Do you want to push docker images to docker hub?')
        booleanParam(name: "DEPLOY_BUILD", defaultValue: true, description: 'Is the build required to be deployed to environment or not?')
        booleanParam(name: "NR_ENABLED", defaultValue: true, description: 'Do you want to enable newrelic?')
        booleanParam(name: "IS_PRE_RELEASE", defaultValue: params.IS_PRE_RELEASE ?: false, description: 'Is this a pre-release build?')
        booleanParam(name: "IS_HOTFIX_RELEASE", defaultValue: params.IS_HOTFIX_RELEASE ?: false, description: 'Is this a hotfix build?')
        booleanParam(name: "IS_RELEASE", defaultValue: params.IS_RELEASE ?: false, description: 'Is this a release build?')
    }    
    agent {label "${params.AGENT}"}
    environment{
        BUILD_ENV="${params.BUILD_ENV}"
        IMAGE_REPO_NAME="sourcefuse"
        IMAGE_TAG_VERSION="0.0.0-dev.${env.BUILD_NUMBER}"
        HELM_VALUES_YAML_PATH="<%= helmPath %>"
        NR_ENABLED_VALUE="${params.NR_ENABLED ? '1': '0'}"
        DOCKER_BUILDKIT="1"
        DOCKERHUB_CREDENTIALS=credentials('sourcefuse-dockerhub-credentials')
	    <%= projectName %>_API_CREDENTIALS=credentials('sourcefuse-github-access-user')
	    HUSKY="0"
        GIT_API_BRANCH="${params.GIT_TAG_OR_BRANCH}"
        GIT_REPO_NAME="sourcefuse/<%= project %>-api.git"
        PROJECT_KEY="sourcefuse_<%= project %>-api"
	    SONAR_TOKEN=credentials('<%= project %>-sonar-token')
	    SNYK_TOKEN=credentials('<%= project %>-snyk-token')
	    SNYK_FAIL_BUILD="1"
	    SNYK_SEVERITY_THRESHOLD="high"
    }
    tools {
        nodejs 'NodeJS 18.16.0'
    }
    stages{
        stage('git-setup-and-fetch'){
            steps{
                slackSend channel: 'dummy-alerts', message: 'Build started: '+JOB_NAME+' - #'+BUILD_NUMBER+' (<'+BUILD_URL+'|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
                sh "sudo npm install -g lerna@5.5.4"
                sh "sudo npm install -g npm-merge-driver"
                sh "sudo git config --global --add safe.directory $WORKSPACE"
                sh "sudo git remote rm origin"
                sh "sudo git config --global credential.helper store"
                sh "sudo git config --global credential.helper cache"
                sh "sudo git config --global credential.helper 'cache --timeout=6000'"
                sh "sudo git config --global user.name 'ayushi212001'"
                sh "sudo git config --global user.email ayushit45@gmail.com"
                sh "sudo git remote add origin 'https://$<%= projectName %>_API_CREDENTIALS@github.com/$GIT_REPO_NAME'"
                sh "sudo git fetch"
            }
        }
        stage('check-branch-or-tag') {
            steps {
                script {
                    def isTag = sh(script: "git rev-parse -q --verify refs/tags/$GIT_API_BRANCH", returnStatus: true) == 0
                    def isBranch = sh(script: "git rev-parse -q --verify refs/heads/$GIT_API_BRANCH", returnStatus: true) == 0
                    def isRemoteBranch = sh(script: "git rev-parse -q --verify refs/remotes/$GIT_API_BRANCH", returnStatus: true) == 0
                    if (isTag) {
                        echo "$GIT_API_BRANCH is a tag."
                        // Set the value to be used later in the Jenkins pipeline
                        env.GIT_NAME_TYPE = 'tag'
                        sh "sudo git checkout $GIT_API_BRANCH"
                    } else if (isBranch || isRemoteBranch) {
                        echo "$GIT_API_BRANCH is a branch."
                        // Set the value to be used later in the Jenkins pipeline
                        env.GIT_NAME_TYPE = 'branch'
                        sh "sudo git checkout --track $GIT_API_BRANCH"
                    } else {
                        echo "$GIT_API_BRANCH is neither a tag nor a branch."
                        // Set the value to be used later in the Jenkins pipeline
                        env.GIT_NAME_TYPE = 'unknown'
                    }
                }
            }
        }
        stage('check-last-commit') {
            steps {
                script {
                   if(params.IS_RELEASE == false && params.IS_PRE_RELEASE == false && params.IS_HOTFIX_RELEASE == false){
                        env.LAST_COMMIT = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
                    } else {
                        env.LAST_COMMIT = sh(script: "git log --grep='^chore(release): publish' -1 --format='%H'", returnStdout: true).trim()
                    }
                    echo "$LAST_COMMIT is the last release commit."
                }
            }
        }
        stage('Sonar-analysis') {
            when {
                expression { params.RUN_SONAR_CHECKS == true }
            }
            steps {
                script {
                    sh "chmod +x ./sonar-analysis.sh && ./sonar-analysis.sh"
		            sh "if [ \$(jq -r '.projectStatus.status' $WORKSPACE/sonar_result.json) = 'ERROR' ] ; then echo 'SONAR FAILED' ; exit 1 ; fi"
		            sh "if [ \$(jq -r '.projectStatus.status' $WORKSPACE/sonar_result.json) = 'OK' ] ; then echo 'SONAR PASSED' ; fi"
                    sh "sudo git stash -u"
                }
            }
        }
        stage('Snyk-analysis') {
            when {
                expression { params.RUN_SNYK_CHECKS == true }
            }
            steps {
                script {
                    sh "if [ \$SNYK_FAIL_BUILD = 1 ]; then sudo npm install snyk -g && snyk auth $SNYK_TOKEN && snyk test --org=ashishkaushik --strict-out-of-sync=false --fail-on=all --all-projects  --policy-path=./.snyk --severity-threshold=$SNYK_SEVERITY_THRESHOLD; fi"
                    sh "sudo git stash -u"
                }
            }
        }
        stage('Dev-tag') {
            steps {
                script {
                    if(params.IS_RELEASE == false && params.IS_PRE_RELEASE == false && params.IS_HOTFIX_RELEASE == false){
                        env.IMAGE_OPTIONAL_VERSION = "-${env.BUILD_NUMBER}"
                    } else {
                        env.IMAGE_OPTIONAL_VERSION = ''
                    }
                }
            }
        }
        stage('Prerelease-tag') {
            when {
                expression { env.GIT_NAME_TYPE == 'branch' && params.IS_PRE_RELEASE == true }
            }
            steps {
                script {
                    sh "sudo lerna version --conventional-commits --conventional-prerelease --yes"
                }
            }
        }
        stage('Hotfix-tag') {
            when {
                expression { env.GIT_NAME_TYPE == 'branch' && params.IS_HOTFIX_RELEASE == true }
            }
            steps {
                script {
                    sh "sudo lerna version --conventional-commits --conventional-prerelease --preid hotfix --yes"
                }
            }
        }
        stage('Release-tag') {
            when {
                expression { env.GIT_NAME_TYPE == 'branch' && params.IS_RELEASE == true }
            }
            steps {
                script {
                    sh "sudo lerna version --conventional-commits --conventional-graduate --yes"
                }
            }
        }
        stage('Pre-build'){
            when {
                expression { params.BUILD_NEEDED == true }
            }
            steps{
                script{
                    sh "sudo git stash -u"
                    sh "sudo wget https://github.com/mikefarah/yq/releases/download/v4.27.2/yq_linux_arm64 -O /usr/bin/yq && sudo chown ubuntu:ubuntu /usr/bin/yq && sudo chmod +x /usr/bin/yq"
                    sh "sudo chown -R ubuntu:ubuntu ${env.WORKSPACE}/"
                    if (params.FULL_BUILD){
		                sh "lerna exec --scope='@local/*' -- npm ci"
                        sh "lerna bootstrap --include-dependencies"
                        sh "sudo git stash -u"
                        sh "lerna run resolve-links"
                    } else {
		                sh "lerna exec --scope='@local/*'  --include-dependencies -- npm ci"
                        sh "lerna bootstrap --since ${env.LAST_COMMIT}"
                        sh "lerna ls --since ${env.LAST_COMMIT}"
                        sh "lerna run resolve-links --since ${env.LAST_COMMIT}"
                    }
                }
            }
        }
        stage('Unit-tests') {
            when {
                expression { params.RUN_UNIT_TESTS == true }
            }
            steps {
                script {
                    if (params.FULL_BUILD) {
                        sh "lerna run coverage --concurrency 1"
                    } else {
                        sh "lerna run coverage --concurrency 1 --since ${env.LAST_COMMIT}"
                    }
                }
            }
        }
        stage('Prune-deps') {
            steps {
                script {
                    sh "sudo chown -R ubuntu:ubuntu ${env.WORKSPACE}/"
                    sh "lerna run prune"
                    sh "git stash -u"
                }
            }
        }
        stage('Docker-build') {
            when {
                expression { params.BUILD_NEEDED == true }
            }
            steps{
                script{	
                    if (params.FULL_BUILD){
                        sh "lerna run docker:build --concurrency 1 -- --IMAGE_REPO_NAME=$IMAGE_REPO_NAME --NR_ENABLED_VALUE=$NR_ENABLED_VALUE --IMAGE_OPTIONAL_VERSION=$IMAGE_OPTIONAL_VERSION"
                    } else {
                        sh "lerna run docker:build  --since $LAST_COMMIT --concurrency 1 -- --IMAGE_REPO_NAME=$IMAGE_REPO_NAME --NR_ENABLED_VALUE=$NR_ENABLED_VALUE --IMAGE_OPTIONAL_VERSION=$IMAGE_OPTIONAL_VERSION"
                    }
                }
             }       
        }
        stage('Docker-push') {
            when {
                expression { params.RELEASE_NEEDED == true && params.BUILD_NEEDED == true }
            }
            steps{
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | sudo docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    if (params.FULL_BUILD){
                        sh "lerna run docker:push --concurrency 4 -- --IMAGE_REPO_NAME=$IMAGE_REPO_NAME --IMAGE_OPTIONAL_VERSION=$IMAGE_OPTIONAL_VERSION"
                    } else {
                        sh "lerna run docker:push  --since $LAST_COMMIT --concurrency 4 -- --IMAGE_REPO_NAME=$IMAGE_REPO_NAME --IMAGE_OPTIONAL_VERSION=$IMAGE_OPTIONAL_VERSION"
                    }
                }
            }
        }
        stage('Update-helm-values'){
            when {
                expression { params.DEPLOY_BUILD == true }
            }
            steps{
                script{
                    dir('<%= project %>-helm'){
                        git branch: 'main', credentialsId: 'sourcefuse-github-access-user', url: 'https://github.com/sourcefuse/<%= project %>-helm.git'
                        dir('charts/<%= project %>'){
                            if (params.FULL_BUILD){
                                sh "lerna run helm-update --concurrency 1 -- --WORKSPACE=$WORKSPACE --BUILD_ENV=$BUILD_ENV --HELM_VALUES_YAML_PATH=$HELM_VALUES_YAML_PATH --IMAGE_OPTIONAL_VERSION=$IMAGE_OPTIONAL_VERSION"
                            } else {
                                sh "lerna run helm-update --since $LAST_COMMIT --concurrency 1 -- --WORKSPACE=$WORKSPACE --BUILD_ENV=$BUILD_ENV --HELM_VALUES_YAML_PATH=$HELM_VALUES_YAML_PATH --IMAGE_OPTIONAL_VERSION=$IMAGE_OPTIONAL_VERSION"
                            }
                        }
                        sh "sudo git config --global --add safe.directory $WORKSPACE/<%= project %>-helm"
                        sh "sudo git config --global user.name 'sf-jenkins-github'"
                        sh "sudo git config --global user.email devops@sourcefuse.com"
                        sh "sudo git add ."
                        withCredentials([usernamePassword(credentialsId: 'sourcefuse-github-access-user', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]){
                            sh ('''
                                if output=$(git status --porcelain) && [ -z "$output" ]; then
                                    echo "Nothing to commit in helm repo."
                                else
                                    sudo git commit -m "feat: update image tags in values.yaml"
                                    sudo git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/sourcefuse/<%= project %>-helm.git
                                fi
                               '''
                            )
                        }
                    }  
                }    
            }
        }
    }
    post {
	    always {
            script {
                sh "sudo git remote rm origin"
                sh "sudo git gc --prune=now"
                sh "sudo rm -rf .git"
            }
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: false,
                    patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                               [pattern: '.propsfile', type: 'EXCLUDE']])
        }
        failure {
            slackSend channel: 'dummy-alerts',color: 'danger', failOnError:true, message: 'Build failed: '+JOB_NAME+' - #'+BUILD_NUMBER+' (<'+BUILD_URL+'|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
        }
        aborted {
            slackSend channel: 'dummy-alerts',color: 'warning', message: 'Build aborted: '+JOB_NAME+' - #'+BUILD_NUMBER+' (<'+BUILD_URL+'|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
        }
        success {
            slackSend channel: 'dummy-alerts',color: 'good', message: 'Build successfull: '+JOB_NAME+' - #'+BUILD_NUMBER+' (<'+BUILD_URL+'|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
        }
    } 
}