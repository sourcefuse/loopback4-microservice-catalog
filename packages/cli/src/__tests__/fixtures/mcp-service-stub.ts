// eslint-disable-next-line @typescript-eslint/naming-convention
import Sinon from 'sinon';
import {z} from 'zod';
import {AnyObject} from '../../types';

export class McpServerStub {
  private callStub: Sinon.SinonStub;
  constructor(callStub: Sinon.SinonStub) {
    this.callStub = callStub;
  }

  private toolMap: Record<string, Function> = {};

  tool(
    name: string,
    description: string,
    params: Record<string, z.ZodTypeAny>,
    run: (
      args: Record<string, AnyObject[string]>,
    ) => Promise<AnyObject[string]>,
  ): void {
    this.toolMap[name] = async (args: Record<string, AnyObject[string]>) => {
      try {
        const parsedArgs = z.object(params).parse(args);
        return await run(parsedArgs);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Validation error: ${error.message}`);
        }
        throw error;
      }
    };
  }

  callTool(
    name: string,
    args: Record<string, AnyObject[string]>,
  ): Promise<AnyObject[string]> {
    if (!this.toolMap[name]) {
      throw new Error(`Tool ${name} not found`);
    }
    return this.toolMap[name](args);
  }

  async connect() {
    this.callStub({
      type: 'connect',
      message: 'MCP Server connected successfully',
    });
  }
}
