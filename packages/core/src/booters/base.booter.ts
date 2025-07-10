import {
  ArtifactOptions,
  Booter,
  discoverFiles,
  loadClassesFromFiles,
} from '@loopback/boot';
import {Constructor} from 'loopback4-soft-delete';

export class BaseBooter implements Booter {
  /**
   * Options being used by the Booter.
   */
  options: ArtifactOptions;
  /**
   * Project root relative to which all other paths are resolved
   */
  projectRoot: string;
  /**
   * Relative paths of directories to be searched
   */
  dirs: string[];
  /**
   * File extensions to be searched
   */
  extensions: string[];
  /**
   * `glob` pattern to match artifact paths
   */
  glob: string;

  /**
   * List of files discovered by the Booter that matched artifact requirements
   */
  discovered: string[];
  /**
   * List of exported classes discovered in the files
   */
  classes: Constructor<{}>[];

  /**
   * Get the name of the artifact loaded by this booter, e.g. "Controller".
   * Subclasses can override the default logic based on the class name.
   */
  get artifactName(): string {
    return this.constructor.name.replace(/Booter$/, '');
  }

  /**
   * Configure the Booter by initializing the 'dirs', 'extensions' and 'glob'
   * properties.
   *
   * NOTE: All properties are configured even if all aren't used.
   */
  async configure() {
    this.dirs = this.normalizeToArray(this.options.dirs);
    this.extensions = this.normalizeToArray(this.options.extensions);

    const joinedDirs = this.formatDirs(this.dirs);
    const joinedExts = `@(${this.extensions.join('|')})`;

    this.glob =
      this.options.glob ??
      `/${joinedDirs}/${this.options.nested ? '**/*' : '*'}${joinedExts}`;
  }

  private normalizeToArray<T>(value: T | T[] | undefined): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  private formatDirs(dirs: string[]): string {
    if (dirs.length > 1) return `{${dirs.join(',')}}`;
    return dirs.join(',');
  }

  /**
   * Discover files based on the 'glob' property relative to the 'projectRoot'.
   * Discovered artifact files matching the pattern are saved to the
   * 'discovered' property.
   */
  async discover() {
    this.discovered = await discoverFiles(this.glob, this.projectRoot);
  }

  /**
   * Filters the exports of 'discovered' files to only be Classes (in case
   * function / types are exported) as an artifact is a Class. The filtered
   * artifact Classes are saved in the 'classes' property.
   *
   * NOTE: Booters extending this class should call this method (await super.load())
   * and then process the artifact classes as appropriate.
   */
  async load() {
    this.classes = loadClassesFromFiles(this.discovered, this.projectRoot);
  }
}
