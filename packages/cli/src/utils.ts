// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const JSON_SPACING = 4;

export function appendDependencies(dependencies: Record<string, string>) {
  const packageJson = require('../package.json');

  const deps = Object.assign({}, dependencies);
  const newDependencies = packageJson?.config?.templateDependencies ?? {};
  for (const i in newDependencies) {
    if (newDependencies[i]) {
      deps[i] = newDependencies[i];
    } else {
      throw new Error(`Missing dependency version in config: ${i}`);
    }
  }
  return deps;
}

export function getDependencyVersion(
  dependencies: Record<string, string>,
  name: string,
) {
  const packageJson = require('../package.json');

  const newDependencies = packageJson?.config?.templateDependencies ?? {};
  const deps = Object.assign(dependencies, newDependencies);

  if (deps[name]) {
    return deps[name];
  } else {
    throw new Error(`Missing dependency version in config: ${name}`);
  }
}
