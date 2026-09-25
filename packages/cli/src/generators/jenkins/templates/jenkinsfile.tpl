// Build flow, full vs code builds and the USE_NFT_BUILD fallback are explained in
// https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/packages/cli/src/generators/microservice/docs/docker-builds.md
pipeline {
    parameters {
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
        booleanParam(name: "BUILD_ALL_PACKAGES", defaultValue: params.BUILD_ALL_PACKAGES ?: false, description: 'Full build of every package. Turns off change detection and --since filtering.')
        booleanParam(name: "USE_NFT_BUILD", defaultValue: params.USE_NFT_BUILD != null ? params.USE_NFT_BUILD : true, description: 'Do full builds with the shared deps image and dependency tracing (Dockerfile.nft). Uncheck to use the legacy per-image npm ci build (Dockerfile).')
        booleanParam(name: "RUN_SONAR_CHECKS", defaultValue: params.RUN_SONAR_CHECKS ?: false, description: 'Do you want to run Sonar analysis?')
        booleanParam(name: "RUN_TRIVY_CHECKS", defaultValue: params.RUN_TRIVY_CHECKS ?: false, description: 'Do you want to run Trivy analysis?')
        booleanParam(name: "RUN_UNIT_TESTS", defaultValue: params.RUN_UNIT_TESTS ?: false, description: 'Do you want to run unit tests?')
        booleanParam(name: "BUILD_NEEDED", defaultValue: true, description: 'Do you want to build docker images?')
        booleanParam(name: "RELEASE_NEEDED", defaultValue: true, description: 'Do you want to push docker images to the registry?')
        booleanParam(name: "DEPLOY_BUILD", defaultValue: true, description: 'Is the build required to be deployed to environment or not?')
        booleanParam(name: "IS_PRE_RELEASE", defaultValue: params.IS_PRE_RELEASE ?: false, description: 'Is this a pre-release build?')
        booleanParam(name: "IS_HOTFIX_RELEASE", defaultValue: params.IS_HOTFIX_RELEASE ?: false, description: 'Is this a hotfix build?')
        booleanParam(name: "IS_RELEASE", defaultValue: params.IS_RELEASE ?: false, description: 'Is this a release build?')
        booleanParam(name: "BYPASS_IMAGE_PROMOTION", defaultValue: false, description: 'Do not promote images from the previous environment. Build new images instead.')
        string(
            name: 'PROMOTION_CHAIN',
            defaultValue: params.PROMOTION_CHAIN ?: 'dev,qa,production',
            description: 'Ordered comma-separated promotion chain, e.g. dev,qa,production'
        )
    }
    agent { label "${params.AGENT}" }
    environment {
        BUILD_ENV = "${params.BUILD_ENV}"
        IMAGE_REPO_NAME = "sourcefuse"
        HELM_VALUES_YAML_PATH = "<%= helmPath %>/${params.BUILD_ENV}"
        DOCKER_BUILDKIT = "1"
        DOCKERHUB_CREDENTIALS = credentials('sourcefuse-dockerhub-credentials')
        <%= projectName %>_API_CREDENTIALS = credentials('sourcefuse-github-access-user')
        HUSKY = "0"
        GIT_API_BRANCH = "${params.GIT_TAG_OR_BRANCH}"
        GIT_REPO_NAME = "sourcefuse/<%= project %>-api.git"
        PROJECT_KEY = "sourcefuse_<%= project %>-api"
        SONAR_TOKEN = credentials('<%= project %>-sonar-token')
    }
    tools {
        nodejs 'NodeJS 24.13.0'
    }
    stages {
        stage('git-setup-and-fetch') {
            steps {
                slackSend channel: 'dummy-alerts', message: 'Build started: ' + JOB_NAME + ' - #' + BUILD_NUMBER + ' (<' + BUILD_URL + '|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
                // Global, because the version stages run lerna before `npm ci`. Keep in sync with the root devDependency.
                sh "sudo npm install -g lerna@9.0.7"
                sh "sudo npm install -g npm-merge-driver"
                sh "sudo git config --global --add safe.directory $WORKSPACE"
                sh "sudo git remote rm origin"
                sh "sudo git config --global credential.helper store"
                sh "sudo git config --global credential.helper cache"
                sh "sudo git config --global credential.helper 'cache --timeout=6000'"
                sh "sudo git config --global user.name 'sf-jenkins-github'"
                sh "sudo git config --global user.email devops@sourcefuse.com"
                sh "sudo git remote add origin 'https://$<%= projectName %>_API_CREDENTIALS@github.com/$GIT_REPO_NAME'"
                // get-full-build-packages.sh needs jq. `dpkg --print-architecture` picks the binary for this agent (amd64 or arm64).
                sh 'command -v jq || (sudo wget -q -O /usr/bin/jq https://github.com/jqlang/jq/releases/download/jq-1.8.1/jq-linux-$(dpkg --print-architecture) && sudo chmod +x /usr/bin/jq)'
                sh "sudo git fetch"
            }
        }
        stage('check-branch-or-tag') {
            steps {
                script {
                    def isTag = sh(script: "git rev-parse -q --verify refs/tags/$GIT_API_BRANCH", returnStatus: true) == 0
                    def isBranch = sh(script: "git rev-parse -q --verify refs/heads/$GIT_API_BRANCH", returnStatus: true) == 0
                    def isRemoteBranch = sh(script: "git rev-parse -q --verify refs/remotes/$GIT_API_BRANCH", returnStatus: true) == 0
                    env.BUILD_ALL_PACKAGES = params.BUILD_ALL_PACKAGES
                    if (isTag) {
                        echo "$GIT_API_BRANCH is a tag."
                        env.GIT_NAME_TYPE = 'tag'
                        sh "sudo git checkout $GIT_API_BRANCH"
                    } else if (isBranch || isRemoteBranch) {
                        echo "$GIT_API_BRANCH is a branch."
                        env.GIT_NAME_TYPE = 'branch'
                        sh "sudo git checkout --track $GIT_API_BRANCH"
                    } else {
                        echo "$GIT_API_BRANCH is neither a tag nor a branch."
                        env.GIT_NAME_TYPE = 'unknown'
                    }
                }
            }
        }
        stage('check-last-commit') {
            steps {
                script {
                    if (!params.IS_RELEASE && !params.IS_PRE_RELEASE && !params.IS_HOTFIX_RELEASE) {
                        env.LAST_COMMIT = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
                    } else {
                        env.LAST_COMMIT = sh(script: "git log --grep='^chore(release): publish' -1 --format='%H'", returnStdout: true).trim()
                    }
                    // Without a last commit, --since has nothing to compare with.
                    if (!env.LAST_COMMIT) {
                        env.BUILD_ALL_PACKAGES = true
                    }
                    echo "${env.LAST_COMMIT} is the last release commit."
                }
            }
        }
        stage('Sonar-analysis') {
            when {
                expression { params.RUN_SONAR_CHECKS }
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
        stage('Trivy-analysis') {
            when {
                expression { params.RUN_TRIVY_CHECKS }
            }
            steps {
                script {
                    // Pinned by digest. Bump on purpose: trivy's release channel was compromised in March 2026.
                    sh 'sudo docker run --rm -v "$PWD:/src" -w /src aquasec/trivy:0.74.0@sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969 -c trivy.yml fs .'
                    sh "sudo git stash -u"
                }
            }
        }
        // Runs before the version stages, so the diff shows real changes and not lerna version bumps.
        stage('Detect-changes') {
            when {
                expression { params.BUILD_NEEDED }
            }
            steps {
                script {
                    def scriptArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : env.LAST_COMMIT
                    env.FULL_BUILD_PACKAGES = sh(
                        script: "bash ${WORKSPACE}/scripts/get-full-build-packages.sh ${scriptArg}",
                        returnStdout: true
                    ).trim()
                    echo "Packages that need a full build: ${env.FULL_BUILD_PACKAGES ?: 'none'}"
                    // A root-level trigger (lockfile, patches/, Dockerfile.deps, tracer, root nft)
                    // marks every image, but `lerna --since` only sees changes inside package
                    // folders, so push, tag and helm-update would skip them. Drop --since then.
                    if (env.FULL_BUILD_PACKAGES && !env.BUILD_ALL_PACKAGES.toBoolean()) {
                        def allImagePackages = sh(
                            script: "bash ${WORKSPACE}/scripts/get-full-build-packages.sh",
                            returnStdout: true
                        ).trim()
                        if (env.FULL_BUILD_PACKAGES == allImagePackages) {
                            env.BUILD_ALL_PACKAGES = 'true'
                        }
                    }
                }
            }
        }
        stage('Dev-tag') {
            steps {
                script {
                    if (!params.IS_RELEASE && !params.IS_PRE_RELEASE && !params.IS_HOTFIX_RELEASE) {
                        env.IMAGE_OPTIONAL_VERSION = "-${env.BUILD_NUMBER}"
                    } else {
                        env.IMAGE_OPTIONAL_VERSION = ''
                    }
                }
            }
        }
        stage('Prerelease-tag') {
            when {
                expression { env.GIT_NAME_TYPE == 'branch' && params.IS_PRE_RELEASE }
            }
            steps {
                sh "sudo lerna version --conventional-commits --conventional-prerelease --yes"
            }
        }
        stage('Hotfix-tag') {
            when {
                expression { env.GIT_NAME_TYPE == 'branch' && params.IS_HOTFIX_RELEASE }
            }
            steps {
                sh "sudo lerna version --conventional-commits --conventional-prerelease --preid hotfix --yes"
            }
        }
        stage('Release-tag') {
            when {
                expression { env.GIT_NAME_TYPE == 'branch' && params.IS_RELEASE }
            }
            steps {
                sh "sudo lerna version --conventional-commits --conventional-graduate --yes"
            }
        }
        stage('Pre-build') {
            when {
                expression { params.BUILD_NEEDED }
            }
            steps {
                script {
                    sh "sudo git stash -u"
                    sh "sudo chown -R ubuntu:ubuntu ${env.WORKSPACE}/"
                    sh "npm ci --ignore-scripts"
                    if (!env.BUILD_ALL_PACKAGES.toBoolean()) {
                        sh "lerna ls --since ${env.LAST_COMMIT}"
                    }
                }
            }
        }
        stage('Unit-tests') {
            when {
                expression { params.RUN_UNIT_TESTS }
            }
            steps {
                script {
                    def sinceArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : "--since ${env.LAST_COMMIT}"
                    sh "lerna run coverage --concurrency 1 ${sinceArg}"
                }
            }
        }
        // Higher environments reuse the images of the previous environment in PROMOTION_CHAIN.
        stage('Docker-retag') {
            when {
                expression { params.BUILD_NEEDED && !params.BYPASS_IMAGE_PROMOTION }
            }
            steps {
                script {
                    def promotionChain = params.PROMOTION_CHAIN.tokenize(',').collect { it.trim() }
                    def idx = promotionChain.indexOf(env.BUILD_ENV)
                    if (idx == -1) {
                        error("BUILD_ENV=${env.BUILD_ENV} is not in PROMOTION_CHAIN=${params.PROMOTION_CHAIN}")
                    }
                    if (idx == 0 || params.IS_HOTFIX_RELEASE) {
                        echo "Skipping retag: BUILD_ENV=${env.BUILD_ENV}, IS_HOTFIX_RELEASE=${params.IS_HOTFIX_RELEASE}"
                        return
                    }
                    def sourceEnv = promotionChain[idx - 1]
                    def sinceArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : "--since ${env.LAST_COMMIT}"
                    echo "Retagging images from ${sourceEnv} to ${env.BUILD_ENV}"
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | sudo docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    withEnv(["SOURCE_ENV=${sourceEnv}"]) {
                        sh "lerna run docker:retag ${sinceArg} --concurrency 4"
                    }
                }
            }
        }
        stage('Docker-build') {
            when {
                expression {
                    def chain = params.PROMOTION_CHAIN.tokenize(',').collect { it.trim() }
                    params.BUILD_NEEDED && (env.BUILD_ENV == chain[0] || params.IS_HOTFIX_RELEASE || params.BYPASS_IMAGE_PROMOTION)
                }
            }
            steps {
                script {
                    def sinceArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : "--since ${env.LAST_COMMIT}"
                    def fullBuildPkgs = env.FULL_BUILD_PACKAGES ?: ''
                    def scopeFilter = fullBuildPkgs.contains(',') ? "{${fullBuildPkgs}}" : fullBuildPkgs
                    def useNft = params.USE_NFT_BUILD

                    // Code and nft images copy the host-built dist. The nft build of a
                    // full-build package needs dist even if its source did not change,
                    // so then we build all. --include-dependencies builds the local
                    // packages that a changed service uses.
                    def hostBuildArg = (useNft && fullBuildPkgs) ? "" : "${sinceArg} --include-dependencies"
                    sh "lerna run clean ${hostBuildArg} && lerna run build ${hostBuildArg}"
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | sudo docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

                    if (fullBuildPkgs) {
                        if (useNft) {
                            sh "npm run docker:build:deps"
                            sh "lerna run docker:build:nft --scope=${scopeFilter} --concurrency 4"
                        } else {
                            // Each legacy build runs its own npm ci. In parallel they can use all agent memory.
                            sh "lerna run docker:build:full --scope=${scopeFilter} --concurrency 1"
                        }
                        sh "lerna run docker:build:code --ignore=${scopeFilter} ${sinceArg} --concurrency 4"
                    } else {
                        sh "lerna run docker:build:code ${sinceArg} --concurrency 4"
                    }
                }
            }
        }
        stage('Docker-push') {
            when {
                expression { params.RELEASE_NEEDED && params.BUILD_NEEDED }
            }
            steps {
                script {
                    def sinceArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : "--since ${env.LAST_COMMIT}"
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | sudo docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh "lerna run docker:push ${sinceArg} --concurrency 4"
                }
            }
        }
        // The environment tag (e.g. :dev) is the base image of the next code build.
        stage('Docker-tag-env') {
            when {
                expression { params.RELEASE_NEEDED && params.BUILD_NEEDED }
            }
            steps {
                script {
                    def sinceArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : "--since ${env.LAST_COMMIT}"
                    sh "lerna run docker:tag ${sinceArg} --concurrency 4"
                }
            }
        }
        stage('Update-helm-values') {
            when {
                expression { params.DEPLOY_BUILD }
            }
            steps {
                script {
                    dir('<%= project %>-helm') {
                        git branch: 'main', credentialsId: 'sourcefuse-github-access-user', url: 'https://github.com/sourcefuse/<%= project %>-helm.git'
                    }
                    sh 'sudo wget -q -O /usr/bin/yq https://github.com/mikefarah/yq/releases/download/v4.27.2/yq_linux_$(dpkg --print-architecture) && sudo chown ubuntu:ubuntu /usr/bin/yq && sudo chmod +x /usr/bin/yq'
                    def sinceArg = env.BUILD_ALL_PACKAGES.toBoolean() ? "" : "--since ${env.LAST_COMMIT}"
                    // concurrency 1: parallel `yq -i` writes to one values file overwrite each other.
                    sh "lerna run helm-update ${sinceArg} --concurrency 1"
                    dir('<%= project %>-helm') {
                        sh "sudo git config --global --add safe.directory ${WORKSPACE}/<%= project %>-helm"
                        sh "sudo git add -A"
                        withCredentials([usernamePassword(credentialsId: 'sourcefuse-github-access-user', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                            sh '''
                                if output=$(git status --porcelain) && [ -z "$output" ]; then
                                    echo "Nothing to commit in helm repo."
                                else
                                    sudo git commit -m "feat: update image tags in values.yaml"
                                    sudo git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/sourcefuse/<%= project %>-helm.git
                                fi
                            '''
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                sh "sudo rm -rf ${WORKSPACE}/<%= project %>-helm"
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
            slackSend channel: 'dummy-alerts', color: 'danger', failOnError: true, message: 'Build failed: ' + JOB_NAME + ' - #' + BUILD_NUMBER + ' (<' + BUILD_URL + '|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
        }
        aborted {
            slackSend channel: 'dummy-alerts', color: 'warning', message: 'Build aborted: ' + JOB_NAME + ' - #' + BUILD_NUMBER + ' (<' + BUILD_URL + '|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
        }
        success {
            slackSend channel: 'dummy-alerts', color: 'good', message: 'Build successful: ' + JOB_NAME + ' - #' + BUILD_NUMBER + ' (<' + BUILD_URL + '|Open>)', teamDomain: 'sourcefuse', tokenCredentialId: 'sourcefuse-slack'
        }
    }
}
