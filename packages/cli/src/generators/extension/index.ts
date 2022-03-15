import { ExtensionOptions } from "../../types";
import BaseExtensionGenerator from "../../extension-generator";
import { join } from "path";
import { writeFileSync } from "fs";
export default class ExtensionGenerator extends BaseExtensionGenerator<ExtensionOptions> {
  constructor(public args: string[], public opts: ExtensionOptions) {
    super(args, opts);
  }

  initializing() {
    if (!this.fs.exists(join(this.destinationPath(), "lerna.json"))) {
      this.exit("Can create an extension only from the root of a monorepo");
    } else {
      this.destinationRoot(join('packages', this.options.name ?? 'module'));
    }
  }

  _setupGenerator() {
    if (!this.shouldExit()) {
      return super._setupGenerator();
    }
  }

  async setOptions() {
    if (!this.shouldExit()) {
      return super.setOptions();
    }
  }

  async promptProjectName() {
    if (!this.shouldExit()) {
      return super.promptProjectName();
    }
  }

  async promptComponent() {
    if (!this.shouldExit()) {
      return super.promptComponent();
    }
  }

  async promptOptions() {
    if (!this.shouldExit()) {
      return super.promptOptions();
    }
  }

  scaffold() {
    if(!this.shouldExit()) {
      return super.scaffold();
    } else {
      return false;
    }
  }

  install() {
    if(!this.shouldExit()) {
      const packageJsonFile = join(this.destinationPath(), "package.json");
      const packageJson = this.fs.readJSON(packageJsonFile) as any;
      packageJson.name = `@local/${packageJson.name}`;
      packageJson.license = "MIT";
      const scripts = packageJson.scripts;
      scripts.preinstall = "npm i @loopback/build --no-save && npm run build";
      scripts.prune = "npm prune --production";
      packageJson.scripts = scripts;
      writeFileSync(packageJsonFile, JSON.stringify(packageJson, undefined, 4));
      return super.install();
    } else {
      return false
    }
  }

  end() {
    return super.end();
  }
}
