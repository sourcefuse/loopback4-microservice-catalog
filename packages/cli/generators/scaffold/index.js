const Generator = require('yeoman-generator');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {answers} = require("./index");

// TODO: Handle how paths are handled since some are not getting redirected correctly
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts, {});
    }


    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'projectDir',
                message: 'Name of the directory in which the project is scaffolded:'
            },
            {
                type: 'input',
                name: 'dbKey',
                message: 'Name of the key for the DB resources:'
            }
        ]);
    }

    // TODO: refactor since this is calling every function and order matters. Order should not matter
    initProject() {
        const templatePath = this.templatePath();
        console.log(`Template path: ${templatePath}`);
        console.log(`Creating directory ${this.answers.projectDir}`);
        fs.mkdir(this.answers.projectDir, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
        });

        // TODO: refactor into common util
        // TODO: determine why lerna is passing back output in STDERR
        // TODO: modify so the commands aren't nested
        console.log('Initializing lerna');
        this._lernaInit();
        this._npmInit();
        this._copyTemplates();
        this._dbMigrate(() => this._setupMigrations(this));
    }

    _dbMigrate(callback) {
        this._spawnProcess('npx', ['lerna', 'create', 'migrations', '-y'], {cwd: this.answers.projectDir}, callback);
    }

    _setupMigrations(instance) {
        fs.rmSync(path.join(instance.answers.projectDir, 'packages', 'migrations', '__tests__'), {recursive: true});
        fs.rmSync(path.join(instance.answers.projectDir, 'packages', 'migrations', 'lib'), {recursive: true});

        const migrationsPath = path.join(instance.answers.projectDir, 'packages', 'migrations');

        instance._spawnProcess('npm', ['i', '--save', 'db-migrate', 'db-migrate-pg', 'dotenv', 'dotenv-extended'], {cwd: migrationsPath}, null);
        instance._spawnProcess('npm', ['i', '--save-dev', '-D', '@types/dotenv', 'dotenv', 'npm-run-all'], {cwd: migrationsPath}, null);

        const packageJsonFile = path.join(process.cwd(), migrationsPath, 'package.json');
        const packageJson = require(packageJsonFile);
        packageJson.scripts = {
            "db:migrate": "run-s db:migrate:*",
            "db:migrate-down": "run-s db:migrate-down:*",
            "db:migrate-reset": "run-s db:migrate-reset:*"
        }

        fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson), null, 2);

        const template = path.join(process.cwd(),instance.answers.projectDir, 'database.json');
        const migrationExecutionPath = path.join(migrationsPath, this.answers.dbKey);
        fs.mkdirSync(migrationExecutionPath);
        fs.copyFileSync(template, path.join(migrationExecutionPath, 'database.json'));
        instance._spawnProcess('npx', ['db-migrate', 'create', 'initial_migration.sql'], {cwd: migrationExecutionPath});
    }

    _lernaInit(callback) {
        this._spawnProcess('npx', ['lerna', 'init', '--independent'], {cwd: this.answers.projectDir}, callback);
    }


    _npmInit(callback) {
        this._spawnProcess('npm', ['i'], {cwd: path.join(this.answers.projectDir)}, callback);
    }


    _spawnProcess(cmd, cmdArgs, cwd, successCallback) {
        const spawnedProcess = spawn(cmd, cmdArgs, {...cwd});

        spawnedProcess.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        spawnedProcess.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        spawnedProcess.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        spawnedProcess.on("close", code => {
            if (successCallback) {
                successCallback();
            }
        });
    }

    // TODO: refactor how templates are handled to use built in APIs

    _copyTemplates() {
        fs.readdirSync(this.templatePath()).forEach(file => {
            console.log(this.templatePath());
            const targetFileName = file.replace('.tpl', '');
            const sourcePath = this.templatePath(file);
            console.log(`Source path: ${sourcePath}`);
            const destinationPath = path.join(this.answers.projectDir, targetFileName);
            // fs.copyFileSync(this.templatePath(file), destinationPath);
            this.fs.copyTpl(sourcePath, destinationPath, {
                upperDbKey: this.answers.dbKey.toUpperCase(),
                ...this.answers
            });
            console.log(file);
        });

        fs.mkdirSync(path.join(this.answers.projectDir, 'services'));
        fs.mkdirSync(path.join(this.answers.projectDir, 'facades'));
    }
};