import Command from '@oclif/command'
import { createEnv } from 'yeoman-environment';

export default abstract class CommandBase<T extends object> extends Command {
  protected async generate(type: string, generatorOptions: T) {
    const env = createEnv()

    env.register(
      require.resolve(`./generators/${type}`),
      `oclif:${type}`
    )

    await new Promise((resolve, reject) => {
      env.run(`oclif:${type}`, generatorOptions);
    })
  }
}
