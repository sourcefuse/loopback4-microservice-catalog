import * as Generator from 'yeoman-generator';
import UpdateGeneratorLb4 from '@loopback/cli/generators/update';
export default class UpdateGenerator<
  T extends Generator.GeneratorOptions,
> extends UpdateGeneratorLb4<T> {
  constructor(args: string[], opts: T) {
    super(args, opts);
  }
}
