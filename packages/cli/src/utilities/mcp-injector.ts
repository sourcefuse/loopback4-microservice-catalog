// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import * as fs from 'fs';
import * as path from 'path';

export interface McpConfig {
  mcpServers: {
    [key: string]: {
      command: string;
      args: string[];
      timeout?: number;
      env?: Record<string, string>;
    };
  };
}

export class McpConfigInjector {
  /**
   * Inject MCP configuration into a project
   */
  injectConfig(projectPath: string, framework?: 'angular' | 'react' | 'backend'): void {
    // Create default MCP configuration
    const mcpConfig: McpConfig = {
      mcpServers: {
        sourceloop: {
          command: 'npx',
          args: ['@sourceloop/cli', 'mcp'],
          timeout: 300,
          env: {
            PROJECT_ROOT: projectPath,
          },
        },
      },
    };

    // Create .claude directory
    const claudeDir = path.join(projectPath, '.claude');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, {recursive: true});
    }

    // Write MCP configuration
    const mcpConfigPath = path.join(claudeDir, 'mcp.json');
    fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpConfig, null, 2), 'utf-8');

    // Create README explaining MCP setup
    const readmePath = path.join(claudeDir, 'README.md');
    const readmeContent = this.generateReadme(framework);
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');

    console.log('✅ MCP configuration added to project');
    console.log('   AI assistants can now interact with this project');
  }

  /**
   * Generate README for MCP setup
   */
  private generateReadme(framework?: string): string {
    return `# MCP Configuration

This project has been configured with Model Context Protocol (MCP) support.

## What is MCP?

MCP enables AI assistants (like Claude Code) to interact with your project through a standardized interface. This allows AI to:
- Generate components, services, and other code artifacts
- Scaffold new features
- Update configuration files
- Provide project-specific assistance

## Usage

### With Claude Code

1. Open this project in an editor with Claude Code support
2. The AI assistant will automatically detect the MCP configuration
3. Use natural language to interact with your project:
   - "Generate a new component called UserProfile"
   - "Create a service for authentication"
   - "Update the API base URL in configuration"

### Manual Usage

You can also use the SourceLoop CLI directly:

${framework ? `\`\`\`bash
# Generate code
sl ${framework}:generate --type component --name MyComponent

# Scaffold new projects
sl ${framework}:scaffold my-new-project

# Update configuration
sl ${framework}:config --help
\`\`\`` : `\`\`\`bash
# Scaffold a new ARC monorepo
sl scaffold my-monorepo

# Add a microservice
sl microservice auth-service

# Update dependencies
sl update
\`\`\``}

## Configuration

The MCP configuration is stored in \`.claude/mcp.json\`. You can customize:
- Timeout values
- Environment variables
- Command arguments

For more information, visit: https://docs.anthropic.com/claude/docs/mcp
`;
  }

  /**
   * Check if project already has MCP configuration
   */
  hasMcpConfig(projectPath: string): boolean {
    const mcpConfigPath = path.join(projectPath, '.claude', 'mcp.json');
    return fs.existsSync(mcpConfigPath);
  }

  /**
   * Update existing MCP configuration
   */
  updateConfig(projectPath: string, updates: Partial<McpConfig>): void {
    const mcpConfigPath = path.join(projectPath, '.claude', 'mcp.json');

    if (!fs.existsSync(mcpConfigPath)) {
      throw new Error('MCP configuration not found. Use injectConfig() first.');
    }

    // Read existing config
    const existingConfig: McpConfig = JSON.parse(
      fs.readFileSync(mcpConfigPath, 'utf-8'),
    );

    // Merge with updates
    const updatedConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        ...updates.mcpServers,
      },
    };

    // Write updated config
    fs.writeFileSync(
      mcpConfigPath,
      JSON.stringify(updatedConfig, null, 2),
      'utf-8',
    );

    console.log('✅ MCP configuration updated');
  }
}
