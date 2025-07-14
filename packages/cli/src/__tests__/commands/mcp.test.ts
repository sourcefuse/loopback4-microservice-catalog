import {McpServer} from '@modelcontextprotocol/sdk/server/mcp';
import {Config} from '@oclif/config';
import {expect} from 'chai';
import {stub} from 'sinon';
import {Mcp} from '../../commands/mcp';
import {TestMCPCommand} from '../fixtures';
import {McpServerStub} from '../fixtures/mcp-service-stub';

describe('mcp', () => {
  let command: Mcp;
  let callStub: sinon.SinonStub;
  let server: McpServerStub;
  beforeEach(async () => {
    command = new Mcp([], new Config({root: ''}), stub(), undefined, [
      TestMCPCommand,
    ]);
    callStub = stub();
    server = new McpServerStub(callStub);
    command.server = server as unknown as McpServer;

    await command.run();
    expect(callStub.callCount).to.eq(1);
  });

  afterEach(() => {
    callStub.resetHistory();
  });

  it('should call tool with correct parameters', async () => {
    const result = await server.callTool('TestMCPCommand', {
      name: 'test',
      description: 'This is a test command',
      owner: 'test-owner',
      cwd: '/test/cwd',
    });
    expect(JSON.parse(result.content[0].text)).to.deep.equal({
      inputs: {
        name: 'test',
        description: 'This is a test command',
        owner: 'test-owner',
        cwd: '/test/cwd',
        // not passed so default value is false for booleans
        integrate: false,
      },
      command: 'test-mcp-command',
    });
  });

  it('should call throw error for registered command if invalid payload is provided', async () => {
    const result = await server.callTool('TestMCPCommand', {
      name: 'test',
      description: 'This is a test command',
      owner: 'test-owner',
      cwd: '/test/cwd',
    });
    expect(JSON.parse(result.content[0].text)).to.deep.equal({
      inputs: {
        name: 'test',
        description: 'This is a test command',
        owner: 'test-owner',
        cwd: '/test/cwd',
        // not passed so default value is false for booleans
        integrate: false,
      },
      command: 'test-mcp-command',
    });
  });
});
