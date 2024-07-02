import fetch from 'node-fetch';
import { existsSync, mkdirSync } from 'node:fs';
import {
  appendFile,
  readFile,
  readdir,
  rename,
  writeFile,
} from 'node:fs/promises';
import zlib from 'node:zlib';
import * as tar from 'tar';
import {
  ObjectLiteralExpression,
  OptionalKind,
  Project,
  PropertyAssignmentStructure,
} from 'ts-morph';
import { BaseGenerator } from '../../base-generator';
import { IacList } from '../../enum';
import { CdkOptions } from '../../types';
const chalk = require('chalk'); //NOSONAR

/**
 * Configuration options for remote repository information.
 */
type RemoteConfig = {
  /**
   * The owner of the remote repository.
   */
  owner: string;
  /**
   * The name of the remote repository.
   */
  repo: string;
  /**
   * The tag of the repository to reference.
   */
  tag: string;
  /**
   * The name of the directory that hosts the arc-cdk templates.
   */
  templateDir: string;
};

/**
 * Configuration for Infrastructure as Code (IAC) handling.
 */
type IacConfig = {
  /**
   * The file that defines the schema for required environment variables.
   * This file specifies what environment variables need to be set for the IAC.
   */
  envSchemaFile: string;
  /**
   * The file that contains the main stack configuration for the specific IAC.
   */
  mainStackFile: string;
  /**
   * An object that holds environment variables to be included in the stack.
   * These variables are typically used to configure resources in the stack.
   *
   * Example:
   * in lambda stack its name is lambdaEnvVariables
   */
  iacEnvObjectName: string;
};

type LambdaConfig = IacConfig & {
  /**
   * The file that serves as the Lambda handler.
   * This file is used to handle Lambda function invocations. (lambda.ts)
   */
  handlerFile: string;
  /**
   * (Optional) The name of the Dockerfile for containerized Lambda functions.
   */
  dockerFile?: string;
};

const filesToKeep: string[] = [];

export default class CdkGenerator extends BaseGenerator<CdkOptions> {
  private remoteConfig: RemoteConfig = {
    owner: 'sourcefuse',
    repo: 'arc-lambda',
    tag: '1.2.0',
    templateDir: 'arc-cdk-templates',
  };
  private [IacList.LAMBDA]: LambdaConfig = {
    envSchemaFile: '.env.schema',
    mainStackFile: 'src/main.ts',
    handlerFile: 'lambda.ts',
    dockerFile: 'Dockerfile',
    iacEnvObjectName: 'lambdaEnvVariables',
  };

  initializing() {
    if (!this.fs.exists(this.destinationPath('package.json'))) {
      throw new Error(
        'Can add cdk only from root of a service. No package.json found',
      );
    }

    if (!this.options.dir) {
      this.options.dir = 'cdk';
    }
    if (!this.options.packageJsonName) {
      this.options.packageJsonName = `arc-cdktf`;
    }
    if (!this.options.iac) {
      throw new Error(
        'Error: The "iac" option is missing. Please provide an iac name.',
      );
    }
    if (!this.options.applicationClassName) {
      throw new Error(
        'Error: The "applicationClassName" option is missing. It is a required field.',
      );
    }
    if (!this.options.relativePathToApp) {
      throw new Error(
        'Error: The "relativePathToApp" option is missing. It is a required field.',
      );
    }

    this.log('Setting up your environment... ⚙️');
  }

  async fetchFiles() {
    const filesFilter = function (filePath: string) {
      return filesToKeep.some(reqPath => filePath.startsWith(reqPath));
    };

    const { owner, repo, tag, templateDir: dir } = this.remoteConfig;
    /**
     * When the tar file is downloaded and extracted it creates a dir structure like
     * ${repo}-${tag}
     *    | -- arc-cdk-templates
     *            | -- ${iac}
     *  so let's say if we choose iac as lambda we need to keep ${repo}-${tag}/arc-cdk-templates/${iac} files.
     */
    filesToKeep.push(`${repo}-${tag}/${dir}/${this.options.iac!}`);

    const url = `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.tar.gz`;
    const outputDir = this.options.dir!;

    try {
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const response = await fetch(url);
      /**
       * We strip 3 leading path segments from file names to match the structure
       * ${repo}-${tag}/arc-cdk-templates/${iac} and avoid creating an unnecessary subdirectory
       * inside the specified output directory (${dir}).
       */
      const stripLeadingPathSegments = 3;

      if (response.ok) {
        await new Promise<void>((resolve, reject) => {
          response.body // Readable Stream
            .pipe(zlib.createGunzip()) // Decompress a gzip stream.; .tar.gz -> .tar
            .pipe(
              tar.extract({
                cwd: outputDir,
                filter: filesFilter,
                strip: stripLeadingPathSegments,
              }),
            )
            .on('entry', entry => {
              this.log(
                chalk.cyan.dim('create: '),
                chalk.cyan(`${this.options.dir}/${entry.path}`),
              );
            })
            .on('finish', resolve)
            .on('error', reject);
        });

        this.log.ok(
          `Scaffolding ${this.options.iac} CDK Stack scripts at: ${outputDir}`,
        );
      } else {
        throw new Error(
          'Failed to download the file. Status code: ' + response.status,
        );
      }
    } catch (error) {
      throw new Error(
        'There was an error while downloading source files' + error,
      );
    }
  }

  async setupFiles() {
    this.log('🛠️ Configuring files to meet your requirements...');
    if (this.options.applicationClassName && this.options.relativePathToApp) {
      let appImport = '';

      const isDefaultExport = await this._isDefaultExport(
        this.options.applicationClassName,
        this.options.relativePathToApp,
      );

      const appImportPath = this._getAppImportPath(
        this.options.relativePathToApp,
      );

      if (!isDefaultExport) {
        appImport = `import {${this.options.applicationClassName}} from '${appImportPath}'`;
      } else {
        appImport = `import ${this.options.applicationClassName} from '${appImportPath}`;
      }

      await this._updateFile(
        this.destinationPath(
          `${this.options.dir}/${(this[this.options.iac!] as LambdaConfig).handlerFile
          }`,
        ),
        '{{app_class_name_placeholder}}',
        this.options.applicationClassName,
      );

      await this._updateFile(
        this.destinationPath(
          `${this.options.dir}/${(this[this.options.iac!] as LambdaConfig).handlerFile
          }`,
        ),
        '{{app_import_placeholder}}',
        appImport,
      );
    } else {
      // Handle the case where applicationClassName or relativePathToApp is undefined
      this.log.error("Application class name or relative path to app is undefined.");
    }


  }

  async updatePackageJsonName() {
    if (this.options.packageJsonName) {
      await this._updateFile(
        this.destinationPath(`${this.options.dir}/package.json`),
        '{{package_json_name_placeholder}}',
        this.options.packageJsonName,
      );
    } else {
      // Handle the case where applicationClassName or relativePathToApp is undefined
      this.log.error("packageJsonName is undefined.");
    }

  }

  async configureEnvs() {
    // Create empty keys in cdk/.env.schema by copying user's env
    const envFile = await this._getPreferredEnvFile(this.destinationRoot());
    const keysToCreate = await this._getEnvKeys(envFile);
    await this._appendEmptyKeysToEnv(
      this.destinationPath(
        `${this.options.dir}/${(this[this.options.iac!] as IacConfig).envSchemaFile
        }`,
      ),
      keysToCreate,
    );

    // Create entries for env variables in stack
    try {
      const { project, sourcefile } = this._parseTsFile(
        this.destinationPath(
          `${this.options.dir!}/${(this[this.options.iac!] as IacConfig).mainStackFile
          }`,
        ),
      );
      // sonarignore:start
      const dec = sourcefile!.getVariableDeclaration(
        // sonarignore:end
        (this[this.options.iac!] as IacConfig).iacEnvObjectName,
      );
      if (dec) {
        const objectLiteralExpression =
          dec.getInitializer() as ObjectLiteralExpression;

        const propertyAssignments = keysToCreate
          .map(key => {
            if (!objectLiteralExpression.getProperty(key)) {
              return {
                name: key,
                initializer: `process.env.${key} ?? ''`,
              };
            }
          })
          .filter(
            element => element !== undefined,
          ) as OptionalKind<PropertyAssignmentStructure>[];

        objectLiteralExpression.addPropertyAssignments(propertyAssignments);
      }
      await project.save();
      this.log.ok('Your files are ready for action! 🎉');
    } catch (error) {
      this.log.error(
        `Failed to update env vars of lambda stack in ${this.options.dir}/${(this[this.options.iac!] as IacConfig).mainStackFile
        }.`,
        error,
      );
    }
  }

  async writing() {
    const packageJsonContent = await readFile(
      `${this.options.dir}/package.json`,
      {
        encoding: 'utf-8',
      },
    );
    const dependencies =
      JSON.parse(packageJsonContent).config.templateDependencies;
    await this._addDependencies(
      this.destinationPath('package.json'),
      dependencies,
    );
  }

  async moveFiles() {
    // We need to move lambda.ts alongside application.ts
    // and Dockerfile.lambda to the root
    // sonarignore:start
    if (this.options.iac === IacList.LAMBDA) {
      const dockerFileName = (this[this.options.iac] as LambdaConfig)
        .dockerFile!;
      // sonarignore:end
      const lambdaFileName = (this[this.options.iac] as LambdaConfig)
        .handlerFile;
      const directory = this.options.dir;

      // if user permits to overwrite, Overwrite Dockerfile
      // else create Dockerfile.lambda
      if (this.options.overwriteDockerfile) {
        await this._moveFile(
          this.destinationPath(`${directory}/${dockerFileName}`),
          this.destinationPath(dockerFileName),
        );
      } else {
        await this._moveFile(
          this.destinationPath(`${directory}/${dockerFileName}`),
          this.destinationPath(`${dockerFileName}.lambda`),
        );
        this.log(
          chalk.yellow.bold(
            'Note: When deploying your Lambda, ensure that you rename "Dockerfile.lambda" to "Dockerfile".',
          ),
        );
      }

      await this._moveFile(
        this.destinationPath(`${directory}/${lambdaFileName}`),
        this.destinationPath(
          this.options.relativePathToApp!.split('/')[0] + '/' + lambdaFileName,
        ),
      );
    }
  }

  install() {
    this.log('Installing project dependencies...');
    this.spawnCommandSync('npm', ['install'], {
      cwd: this.destinationRoot(),
    });

    if (this.options.dir) {
      this.spawnCommandSync('npm', ['install'], {
        cwd: this.destinationPath(this.options.dir),
      });
    } else {
      // Handle the case where applicationClassName or relativePathToApp is undefined
      this.log.error("dir is undefined.");
    }

  }

  async end() {
    const { owner, repo, templateDir: dir } = this.remoteConfig;
    this.log(`
${chalk.green("🚀 Hooray! You're all set to launch your app.")}
Next steps:
  1. Fill up the environment variables in your ${chalk.yellow(
      this.options.dir,
    )} directory.
  2. Build your app.
  3. Run ${chalk.blue(`cdktf deploy ${this.options.iac}`)} to deploy the iac.
  
${chalk.green('Happy Deploying! 🚀')}
`);

    this.log(`
For more information or if you encounter any errors, please refer to the ${chalk.blue(
      'README',
    )} at:
${chalk.blue(`https://github.com/${owner}/${repo}/blob/main/${dir}/README.md`)}
`);
  }

  /**
   * Appends environment keys with empty values to a specified .env file.
   *
   * @param envFilePath - The path to the .env file.
   * @param environmentKeys - environment keys to append
   * @returns A promise that resolves when the keys are written to the file.
   */
  async _appendEmptyKeysToEnv(
    envFilePath: string,
    environmentKeys: string[],
  ): Promise<void> {
    const envString = environmentKeys
      .map((key, index) => (index === 0 ? `\n${key}=${''}` : `${key}=${''}`))
      .join('\n');

    try {
      await appendFile(envFilePath, envString);
    } catch (error) {
      if (error instanceof Error) {
        this.log.error(
          `Error writing to the ${envFilePath} file:`,
          error.message,
        );
      } else {
        this.log.error(error);
      }
    }
  }

  /**
   * Retrieves the preferred .env file from a specified directory.
   * The preference order is: .env.example, .env.schema
   * If none of the preferred files exist, the first matching .env | .env.* file is selected.
   *
   * @param dirPath - The path to the directory where .env files are located.
   * @returns The name of the preferred .env file, or an empty string if none is found.
   */
  async _getPreferredEnvFile(dirPath: string): Promise<string> {
    let result = '';
    const envFilePattern = /^\.env(\..+)?/;

    const preferenceOrder = ['.env.example', '.env.schema'];

    try {
      const filesInDir = await readdir(dirPath);
      const matchingFiles = filesInDir.filter(file =>
        envFilePattern.test(file),
      );

      if (matchingFiles.length === 0) {
        this.log(chalk.yellow('No .env file found in the directory.'));
      }

      for (const preferredFile of preferenceOrder) {
        if (matchingFiles.includes(preferredFile)) {
          result = `${dirPath}/${preferredFile}`;
          break;
        }
      }

      if (!result && matchingFiles.length > 0) {
        result = `${dirPath}/${matchingFiles[0]}`;
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.log.error(`Error reading the directory: ${error.message}`);
      } else {
        this.log.error('Failed to read the directory.', error);
      }
      return result;
    }
  }

  /**
   * Parses a TypeScript (`.ts`) file using the ts-morph package and returns a Project and SourceFile.
   *
   * @param filePath - The path to the TypeScript file to be parsed.
   *
   * @returns An object with two properties:
   *   - `project` - An instance of the Project class from the ts-migrate package.
   *   - `sourcefile` - An optional SourceFile object representing the parsed TypeScript file.
   *     If the file does not exist or could not be parsed, this property will be `undefined`.
   *
   * @example
   * ```typescript
   * const { project, sourcefile } = _parseTsFile('path/to/your/file.ts');
   * if (sourcefile) {
   *  const classes = sourcefile.getClasses();
   *  classes.forEach(c => console.log(c.getName() ?? 'default'));
   *  appClassName = classes[0].getName() ?? '';
   * }
   * ```
   */
  _parseTsFile(filePath: string) {
    const project = new Project();
    const sourcefile = project.addSourceFileAtPathIfExists(filePath);
    return { project, sourcefile };
  }

  /**
   * Reads and parses an environment (`.env`) file to extract environment variable keys.
   *
   * @param filePath - The path to the environment file (`.env`) to be read and parsed.
   * @param encoding - (Optional) The character encoding used to read the file (default: 'utf-8').
   *
   * @returns An array of environment variable keys extracted from the file.
   */
  async _getEnvKeys(filePath: string, encoding: BufferEncoding = 'utf-8') {
    const envData = await readFile(filePath, encoding);
    const lines = envData.split('\n');

    const keys = lines
      .map(line => line.trim()) // Remove leading/trailing whitespace
      .filter(line => line && !line.startsWith('#')) // Exclude empty lines and comments
      .map(line => line.split('=')[0]); // Extract the key (variable name)

    return keys;
  }

  /**
   * Updates a file by replacing all occurrences of a specified placeholder with a replacement string.
   *
   * @param filePath - The path to the file to be updated.
   * @param placeholder - The placeholder string to be replaced.
   * @param replaceWith - The string to replace the placeholder with.
   * @param encoding - (Optional) The character encoding used for reading and writing the file (default: 'utf-8').
   *
   * @returns A Promise that resolves once the file has been successfully updated.
   */
  async _updateFile(
    filePath: string,
    placeholder: string,
    replaceWith: string,
    encoding: BufferEncoding = 'utf-8',
  ) {
    try {
      let data = await readFile(filePath, { encoding });
      data = data.replace(new RegExp(placeholder, 'g'), replaceWith);
      await writeFile(filePath, data, { encoding });
    } catch (error) {
      if (error instanceof Error) {
        this.log.error(error.message);
      } else {
        this.log.error('Unexpected error', error);
      }
    }
  }

  /**
   * Asynchronously adds dependencies and devDependencies to a project's package.json file.
   *
   * @param packageJsonPath - The path to the package.json file to update.
   * @param depsToAdd - An object containing dependencies and devDependencies to add.
   * @param depsToAdd.dependencies - A record of dependencies to add.
   * @param depsToAdd.devDependencies - A record of devDependencies to add.
   */
  async _addDependencies(
    packageJsonPath: string,
    depsToAdd: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    },
  ) {
    const JSON_INDENTATION = 2;
    try {
      const packageJsonContent = await readFile(packageJsonPath, {
        encoding: 'utf-8',
      });
      const parsedPackageJson = JSON.parse(packageJsonContent);

      parsedPackageJson.dependencies = {
        ...depsToAdd.dependencies,
        ...parsedPackageJson.dependencies,
      };

      parsedPackageJson.devDependencies = {
        ...depsToAdd.devDependencies,
        ...parsedPackageJson.devDependencies,
      };

      await writeFile(
        packageJsonPath,
        JSON.stringify(parsedPackageJson, null, JSON_INDENTATION),
      );
    } catch (error) {
      this.log.error(
        `Failed to add dependencies. Please add the following dependencies manually:\n${JSON.stringify(
          depsToAdd,
          null,
          JSON_INDENTATION,
        )}`,
      );
    }
  }

  /**
   * Constructs the import path for a file within an application directory.
   *
   * Given a file path within an application directory, this function constructs
   * the corresponding import path that can be used to import the file relative
   * to the current file.
   * Example: In a normal loopback service the filepath would be src/application.ts
   * and application.ts, lambda.ts would be sibling files.
   * In that case the import in lambda.ts for a class in application.ts would be './application'
   *
   * @param path - The file path within the application directory.
   * @returns The import path relative to the current file.
   */
  _getAppImportPath(path: string) {
    const parts = path.split('/');
    const remainingPath = parts.slice(1).join('/');
    return `./${remainingPath}`;
  }

  /**
   * Checks if a specified class is the default export in a TypeScript file.
   *
   * @param className - The name of the class to check for.
   * @param filePath - The path to the TypeScript file to analyze.
   * @returns `true` if the class is the default export; otherwise, `false`.
   */
  async _isDefaultExport(className: string, filePath: string) {
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const pattern = new RegExp(`default\\s+class\\s+${className}`);
      return pattern.test(fileContent);
    } catch (error) {
      this.log.error(`Error reading ${filePath}`);
      return false;
    }
  }

  /**
   * Moves a file from the source path to the destination path.
   *
   * @param sourcePath - The path to the source file.
   * @param destinationPath - The path to the destination file.
   */
  async _moveFile(sourcePath: string, destinationPath: string) {
    try {
      await rename(sourcePath, destinationPath);
    } catch (error) {
      this.log.error(
        `Error moving file from ${sourcePath} to ${destinationPath}`,
      );
    }
  }
}
