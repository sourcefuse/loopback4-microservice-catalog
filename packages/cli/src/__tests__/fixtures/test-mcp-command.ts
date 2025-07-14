// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {AnyObject, McpTextResponse} from '../../types';

export class TestMCPCommand {
  static readonly description = 'A dummy command to test the MCP functionality';
  static readonly mcpDescription = `
    This is a dummy command to test the MCP functionality.
  `;

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
      type: 'boolean',
    }),
    cwd: flags.string({
      name: 'working-directory',
      description:
        'Directory where project will be scaffolded, instead of the project name',
    }),
    owner: flags.string({
      name: 'owner',
      description: 'owner of the repo',
    }),
    description: flags.string({
      name: 'description',
      description: 'description of the repo',
    }),
    integrate: flags.boolean({
      name: 'integrate',
      description: 'Do you want to include integration files?',
    }),
  };
  static readonly args = [
    {name: 'name', description: 'name of the project', required: false},
  ];

  static async mcpRun(inputs: AnyObject): Promise<McpTextResponse> {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            inputs,
            command: 'test-mcp-command',
          }),
        },
      ],
    };
  }
}
