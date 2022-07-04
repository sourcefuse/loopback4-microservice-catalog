import Generator from 'yeoman-generator';

export interface UpdateOptions extends Generator.GeneratorOptions {
  help?: boolean;
}

// sonarignore:start
export interface DependencyType {
  [key: string]: string;
}

export interface PackageDependencies {
  dependencies: DependencyType;
  devDependencies: DependencyType;
  peerDependencies: DependencyType;
}
// sonarignore:end
