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

  private generateReadme(framework?: 'angular' | 'react' | 'backend'): string {
    const cliCommands =
      framework === 'angular' ||
      framework === 'react' ||
      framework === 'backend'
        ? `
\`\`\`bash
# Generate code
sl ${framework}:generate --type component --name MyComponent

# Scaffold new projects
sl ${framework}:scaffold my-new-project

# Update configuration
sl ${framework}:config --help
\`\`\`
`
        : `
\`\`\`bash
# Scaffold a new ARC monorepo
sl scaffold my-monorepo

# Add a microservice
sl microservice auth-service

# Update dependencies
sl update
\`\`\`
`;

    return `# MCP Configuration

This project has been configured with Model Context Protocol (MCP) support.

## Overview

MCP enables AI assistants (like Claude Code) to interact with your project through a standardized interface. It allows AI to:
- Generate components, services, and other code artifacts
- Scaffold new features
- Update configuration files
- Provide project-specific assistance

## Usage

### In Claude Code
1. Open this project in an MCP-compatible IDE.
2. The AI will automatically detect the configuration.
3. You can ask:
   - "Generate a new component called UserProfile"
   - "Create a service for authentication"
   - "Update the API base URL"

### Manual CLI Usage
${cliCommands}

## Configuration

- File: \`.claude/mcp.json\`
- Customizable: timeouts, env variables, command args

Docs: https://docs.anthropic.com/claude/docs/mcp
`;
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
