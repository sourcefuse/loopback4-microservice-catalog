// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
declare module '@loopback/cli/lib/base-generator' {
  import Generator, {Questions} from 'yeoman-generator';
  class BaseGenerator<
    T extends Generator.GeneratorOptions,
  > extends Generator<T> {
    constructor(args: string[], opts: T);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conflicter: any;
    /**
     * Subclasses can extend _setupGenerator() to set up the generator
     */
    _setupGenerator(): void;
    artifactInfo: object;
    /**
     * Read a json document from stdin
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _readJSONFromStdin(): Promise<any>;
    setOptions(): Promise<void>;
    /**
     * Check if a question can be skipped in `express` mode
     * @param {object} question A yeoman prompt
     */
    _isQuestionOptional(question: object): boolean;
    /**
     * Get the default answer for a question
     * @param {*} question
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _getDefaultAnswer(question: any, answers: any): Promise<object>;
    /**
     * Override the base prompt to skip prompts with default answers
     * @param questions - One or more questions
     */
    prompt<S>(questions: Questions<S>): Promise<S>;
    /**
     * Override the usage text by replacing `yo loopback4:` with `lb4 `.
     */
    usage(): string;
    /**
     * Tell this generator to exit with the given reason
     * @param {string|Error} reason
     */
    exit(reason: string | Error): void;
    exitGeneration: string | Error;
    /**
     * Select pkgManager and install packages
     * @param {String|Array} pkgs
     * @param {Object} options
     * @param {Object} spawnOpts
     */
    pkgManagerInstall(
      pkgs: string | (object | string)[],
      options: Object,
      spawnOpts: Object,
    ): object;
    /**
     * Run `[pkgManager] install` in the project
     */
    install(): boolean;
    /**
     * Wrapper for mem-fs-editor.copyTpl() to ensure consistent options
     *
     * See https://github.com/SBoudrias/mem-fs-editor/blob/master/lib/actions/copy-tpl.js
     *
     * @param {string} from
     * @param {string} to
     * @param {object} context
     * @param {object} templateOptions
     * @param {object} copyOptions
     */
    copyTemplatedFiles(
      from: string,
      to: string,
      context: object,
      templateOptions?: object,
      copyOptions?: object,
    ): object;
    /**
     * Checks if current directory is a LoopBack project by checking for
     * "@loopback/core" package in the dependencies section of the
     * package.json.
     */
    checkLoopBackProject(): object;
    _runNpmScript(projectDir: object, args: object): Promise<object>;
    /**
     * Check if the generator should exit
     */
    shouldExit(): boolean;
    _runLintFix(): Promise<void>;
    /**
     * Print out the exit reason if this generator is told to exit before it ends
     */
    end(): Promise<void>;
    _isGenerationSuccessful(): boolean;
    _updateIndexFile(dir: object, file: object): Promise<void>;
  }

  export = BaseGenerator;
}
