import * as fs from 'node:fs';
import * as path from 'node:path';
import {FileGenerator} from './file-generator';

export interface McpConfig {
  mcpServers: Record<
    string,
    {
      command: string;
      args: string[];
      timeout?: number;
      env?: Record<string, string>;
    }
  >;
}

/**
 * Handles creation and management of MCP configuration (.claude/mcp.json).
 */
export class McpConfigInjector {
  injectConfig(
    projectPath: string,
    framework?: 'angular' | 'react' | 'backend',
  ): void {
    const mcpConfig: McpConfig = {
      mcpServers: {
        sourceloop: {
          command: 'npx',
          args: ['@sourceloop/cli', 'mcp'],
          timeout: 300,
          env: {PROJECT_ROOT: projectPath},
        },
      },
    };

    const claudeDir = path.join(projectPath, '.claude');
    fs.mkdirSync(claudeDir, {recursive: true});

    const mcpConfigPath = path.join(claudeDir, 'mcp.json');
    fs.writeFileSync(
      mcpConfigPath,
      JSON.stringify(mcpConfig, null, 2),
      'utf-8',
    );

    const readmePath = path.join(claudeDir, 'README.md');
    const fg = new FileGenerator();
    fs.writeFileSync(readmePath, fg.generateReadme(framework), 'utf-8');

    console.log('✅ MCP configuration added to project'); // NOSONAR
    console.log('   AI assistants can now interact with this project'); // NOSONAR
  }

  hasMcpConfig(projectPath: string): boolean {
    return fs.existsSync(path.join(projectPath, '.claude', 'mcp.json'));
  }

  updateConfig(projectPath: string, updates: Partial<McpConfig>): void {
    const mcpConfigPath = path.join(projectPath, '.claude', 'mcp.json');
    if (!fs.existsSync(mcpConfigPath)) {
      throw new Error('MCP configuration not found. Run injectConfig() first.');
    }

    const existing = JSON.parse(
      fs.readFileSync(mcpConfigPath, 'utf-8'),
    ) as McpConfig;
    const merged: McpConfig = {
      ...existing,
      mcpServers: {...existing.mcpServers, ...updates.mcpServers},
    };

    fs.writeFileSync(mcpConfigPath, JSON.stringify(merged, null, 2), 'utf-8');
    console.log('✅ MCP configuration updated'); // NOSONAR
  }
}
