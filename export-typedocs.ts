import * as TypeDoc from 'typedoc';
import * as path from 'path';
import {execSync} from 'child_process';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {PackageJson} from 'type-fest';

/**
 * Exports API references using TypeDoc.
 */
class ApiReferenceExporter {
  /**
   * TypeDoc application instance.
   */
  app: TypeDoc.Application;

  /**
   * Universal configuration options for TypeDoc.
   */
  universalConfig: Partial<TypeDoc.TypeDocOptions> = {
    excludeExternals: true,
    logLevel: 'Error',
  };

  /**
   * @param pkg - Lerna package information.
   * @param config - Configuration options for TypeDoc.
   * @param settings - Additional custom settings, eg. `includeOpenAPIDoc`
   */
  constructor(
    private pkg: LernaPackageInfo,
    private config: CustomTypeDocOptions['config'],
    private settings: CustomTypeDocOptions['settings'] = {},
  ) {
    this.app = new TypeDoc.Application();
    this.app.options.addReader(new TypeDoc.TSConfigReader());

    Object.assign(this.config, {
      ...this.universalConfig,
      tsconfig: path.resolve(
        this.pkg.location,
        this.config.tsconfig ?? 'tsconfig.json',
      ),
      entryPoints: this.config.entryPoints.map(filePath =>
        path.resolve(this.pkg.location, filePath),
      ),
    } as typeof this.config);
  }

  /**
   * Runs the exporter.
   */
  async run() {
    this.app.bootstrap(this.config);

    const project = this.app.convert();

    if (!project) {
      throw new Error('Typedoc project reflection is not converted correctly.');
    }

    const outputDir = path.resolve(__dirname, 'docs', this.config.out);

    // Generate docs
    await this.app.generateDocs(project, outputDir);

    // Post export
    if (this.settings.includeOpenAPIDoc) {
      const openAPIDocFile = path.resolve(this.pkg.location, 'openapi.md');
      if (!existsSync(openAPIDocFile)) {
        throw new Error('openapi.md is missing in '.concat(this.pkg.name));
      }

      let openAPIContent = readFileSync(openAPIDocFile, 'utf-8');
      let lines = openAPIContent.split('\n');

      // remove the first few lines as these are open api specific front matter
      const frontMatterEndsAt = 15;
      lines.splice(0, frontMatterEndsAt);

      // join the remaining lines back into a string
      openAPIContent = lines.join('\n');

      // fix language name in codeblocks
      openAPIContent = openAPIContent.replace(
        /```.javascript--nodejs/gm,
        '```js',
      );

      // write openapi.md to `outputDir`
      writeFileSync(path.resolve(outputDir, 'openapi.md'), openAPIContent);
    }
  }
}

async function main() {
  // Get All Public Packages
  const packages: Array<LernaPackageInfo> = JSON.parse(
    execSync(`npx lerna ls --json --loglevel silent`).toString(),
  );

  for (let pkg of packages) {
    const packageJson: PackageJsonWithTypeDoc = await import(
      path.resolve(pkg.location, 'package.json')
    );

    if (
      packageJson.typedoc === undefined ||
      packageJson.typedoc.config === undefined
    ) {
      continue;
    }

    const exporter = new ApiReferenceExporter(
      pkg,
      packageJson.typedoc.config,
      packageJson.typedoc.settings,
    );
    await exporter.run();
  }
}

main();

// Types
interface LernaPackageInfo {
  name: string;
  version: string;
  private: boolean;
  location: string;
}

interface PackageJsonWithTypeDoc extends PackageJson {
  typedoc?: CustomTypeDocOptions;
}

interface ExportSettings {
  /**
   * Settings this to `true` will tweak and copy the `openapi.md` in respective docs folder
   */
  includeOpenAPIDoc?: boolean;
}

type CustomTypeDocOptions = {
  config: Partial<TypeDoc.TypeDocOptions>;
  settings: ExportSettings;
};
