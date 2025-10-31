// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import * as path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class ReactGenerate extends Base<{}> {
  private fileGenerator = new FileGenerator();

  static readonly description =
    'Generate React components, hooks, contexts, pages, and other artifacts';

  static readonly mcpDescription = `
    Use this command to generate React artifacts like components, custom hooks, contexts, pages, services, utilities, and Redux slices.
    The generated files follow React best practices and ARC boilerplate conventions with TypeScript and Material-UI support.

    Examples:
    - Generate a component: type=component, name=UserProfile (defaults to src/Components/)
    - Generate a custom hook: type=hook, name=useAuth (defaults to src/Hooks/)
    - Generate a page: type=page, name=Dashboard (defaults to src/Pages/)
    - Generate a Redux slice: type=slice, name=user (defaults to src/redux/)
    - Generate a context: type=context, name=Theme (defaults to src/Providers/)

    The command will create the necessary files with Material-UI styling patterns and proper folder structure.
  `;

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description: 'Path to the React project root directory',
      required: false,
    }),
  };

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'Show manual pages',
      type: 'boolean',
    }),
    type: flags.enum({
      name: 'type',
      description: 'Type of artifact to generate',
      options: [
        'component',
        'hook',
        'context',
        'page',
        'service',
        'util',
        'slice',
      ],
      required: false,
    }),
    path: flags.string({
      name: 'path',
      description: 'Path where the artifact should be generated',
      required: false,
    }),
    skipTests: flags.boolean({
      name: 'skipTests',
      description: 'Skip generating test files',
      required: false,
    }),
  };

  static readonly args = [
    {
      name: 'name',
      description: 'Name of the artifact to generate',
      required: false,
    },
  ];

  async run() {
    const parsed = this.parse(ReactGenerate);
    const name = parsed.args.name;
    const inputs = {name, ...parsed.flags};

    if (!inputs.name) {
      const answer = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the artifact?',
          validate: (input: string) =>
            input.length > 0 || 'Name is required',
        },
      ]);
      inputs.name = answer.name;
    }

    if (!inputs.type) {
      const answer = await this.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'What type of artifact do you want to generate?',
          choices: [
            'component',
            'hook',
            'context',
            'page',
            'service',
            'util',
            'slice',
          ],
        } as Record<string, unknown>,
      ]);
      inputs.type = answer.type;
    }

    const result = await this.generateArtifact(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const generator = new ReactGenerate([], {} as unknown as IConfig, {} as unknown as PromptFunction);
      const result = await generator.generateArtifact(inputs);
      process.chdir(originalCwd);
      return {
        content: [{type: 'text' as const, text: result, isError: false}],
      };
    } catch (err) {
      process.chdir(originalCwd);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${err instanceof Error ? err.message : err}`,
            isError: true,
          },
        ],
      };
    }
  }

  private getDefaultPathForType(type: string): string {
    switch (type) {
      case 'component':
        return 'src/Components';
      case 'hook':
        return 'src/Hooks';
      case 'context':
        return 'src/Providers';
      case 'page':
        return 'src/Pages';
      case 'slice':
        return 'src/redux';
      default:
        return 'src';
    }
  }

  private async generateArtifact(inputs: AnyObject): Promise<string> {
    const {name, type, path: artifactPath, skipTests} = inputs;
    const projectRoot = this.fileGenerator['getProjectRoot']();

    // Determine the target path based on artifact type (matching boilerplate conventions)
    const defaultPath = this.getDefaultPathForType(type);

    const targetPath = artifactPath
      ? path.join(projectRoot, artifactPath)
      : path.join(projectRoot, defaultPath);

    this.fileGenerator['ensureDirectory'](targetPath);

    const artifacts: string[] = [];

    switch (type) {
      case 'component':
        artifacts.push(...this.generateComponent(name, targetPath, skipTests));
        break;
      case 'hook':
        artifacts.push(...this.generateHook(name, targetPath, skipTests));
        break;
      case 'context':
        artifacts.push(...this.generateContext(name, targetPath));
        break;
      case 'page':
        artifacts.push(...this.generatePage(name, targetPath, skipTests));
        break;
      case 'service':
        artifacts.push(...this.generateService(name, targetPath, skipTests));
        break;
      case 'util':
        artifacts.push(...this.generateUtil(name, targetPath, skipTests));
        break;
      case 'slice':
        artifacts.push(...this.generateSlice(name, targetPath, skipTests));
        break;
      default:
        throw new Error(`Unsupported artifact type: ${type}`);
    }

    return `✅ Successfully generated ${type} '${name}' at:\n${artifacts.map(f => `  - ${f}`).join('\n')}`;
  }

  private generateComponent(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const componentPath = path.join(targetPath, name);
    this.fileGenerator['ensureDirectory'](componentPath);

    const componentName = this.fileGenerator['toPascalCase'](name);
    const files: string[] = [];

    // Component TypeScript file (using Material-UI pattern)
    const tsContent = `import {Box} from '@mui/material';
import React from 'react';

export interface ${componentName}Props {
  // Define your props here
}

const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <Box sx={{p: 2}}>
      <p>${componentName} Component</p>
    </Box>
  );
};

export default ${componentName};
`;
    const tsFile = path.join(componentPath, `${componentName}.tsx`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Index file for easier imports
    const indexContent = `export {default} from './${componentName}';\n`;
    const indexFile = path.join(componentPath, 'index.ts');
    this.fileGenerator['writeFile'](indexFile, indexContent);
    files.push(indexFile);

    // Test file
    if (!skipTests) {
      const testContent = `import {render, screen} from '@testing-library/react';
import React from 'react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('should render successfully', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName} Component')).toBeInTheDocument();
  });
});
`;
      const testFile = path.join(componentPath, `${componentName}.test.tsx`);
      this.fileGenerator['writeFile'](testFile, testContent);
      files.push(testFile);
    }

    return files;
  }

  private generateHook(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const hookPath = targetPath;
    this.fileGenerator['ensureDirectory'](hookPath);

    const hookName = name.startsWith('use')
      ? name
      : `use${this.fileGenerator['toPascalCase'](name)}`;
    const files: string[] = [];

    // Hook TypeScript file
    const tsContent = `import {useState, useEffect} from 'react';

export const ${hookName} = () => {
  const [state, setState] = useState();

  useEffect(() => {
    // Add your effect logic here
  }, []);

  return {
    state,
    setState,
  };
};
`;
    const tsFile = path.join(hookPath, `${hookName}.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Test file
    if (!skipTests) {
      const testContent = `import {renderHook} from '@testing-library/react';
import {${hookName}} from './${hookName}';

describe('${hookName}', () => {
  it('should initialize correctly', () => {
    const {result} = renderHook(() => ${hookName}());
    expect(result.current).toBeDefined();
  });
});
`;
      const testFile = path.join(hookPath, `${hookName}.test.ts`);
      this.fileGenerator['writeFile'](testFile, testContent);
      files.push(testFile);
    }

    return files;
  }

  private generateContext(name: string, targetPath: string): string[] {
    const contextPath = path.join(targetPath, `${name}Context`);
    this.fileGenerator['ensureDirectory'](contextPath);

    const contextName = this.fileGenerator['toPascalCase'](name);
    const files: string[] = [];

    // Context TypeScript file
    const tsContent = `import React, {createContext, useContext, useState, ReactNode} from 'react';

export interface ${contextName}State {
  // Define your state here
}

export interface ${contextName}ContextValue {
  state: ${contextName}State;
  setState: React.Dispatch<React.SetStateAction<${contextName}State>>;
}

const ${contextName}Context = createContext<${contextName}ContextValue | undefined>(undefined);

export interface ${contextName}ProviderProps {
  children: ReactNode;
}

export const ${contextName}Provider: React.FC<${contextName}ProviderProps> = ({children}) => {
  const [state, setState] = useState<${contextName}State>({});

  return (
    <${contextName}Context.Provider value={{state, setState}}>
      {children}
    </${contextName}Context.Provider>
  );
};

export const use${contextName} = (): ${contextName}ContextValue => {
  const context = useContext(${contextName}Context);
  if (!context) {
    throw new Error('use${contextName} must be used within a ${contextName}Provider');
  }
  return context;
};
`;
    const tsFile = path.join(contextPath, `${contextName}Context.tsx`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Index file
    const indexContent = `export * from './${contextName}Context';\n`;
    const indexFile = path.join(contextPath, 'index.ts');
    this.fileGenerator['writeFile'](indexFile, indexContent);
    files.push(indexFile);

    return files;
  }

  private generatePage(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const pagePath = path.join(targetPath, name);
    this.fileGenerator['ensureDirectory'](pagePath);

    const pageName = this.fileGenerator['toPascalCase'](name);
    const files: string[] = [];

    // Page TypeScript file (using Material-UI pattern)
    const tsContent = `import {Box, Typography} from '@mui/material';
import React from 'react';

const ${pageName}Page: React.FC = () => {
  return (
    <Box sx={{p: 3}}>
      <Typography variant="h4" gutterBottom>
        ${pageName} Page
      </Typography>
      {/* Add your page content here */}
    </Box>
  );
};

export default ${pageName}Page;
`;
    const tsFile = path.join(pagePath, `${pageName}.tsx`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Index file
    const indexContent = `export {default} from './${pageName}';\n`;
    const indexFile = path.join(pagePath, 'index.ts');
    this.fileGenerator['writeFile'](indexFile, indexContent);
    files.push(indexFile);

    // Test file
    if (!skipTests) {
      const testContent = `import {render, screen} from '@testing-library/react';
import React from 'react';
import ${pageName}Page from './${pageName}';

describe('${pageName}Page', () => {
  it('should render successfully', () => {
    render(<${pageName}Page />);
    expect(screen.getByText('${pageName} Page')).toBeInTheDocument();
  });
});
`;
      const testFile = path.join(pagePath, `${pageName}.test.tsx`);
      this.fileGenerator['writeFile'](testFile, testContent);
      files.push(testFile);
    }

    return files;
  }

  private generateService(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const servicePath = targetPath;
    this.fileGenerator['ensureDirectory'](servicePath);

    const serviceName = this.fileGenerator['toPascalCase'](name) + 'Service';
    const serviceInstanceName = this.fileGenerator['toCamelCase'](name) + 'Service';
    const files: string[] = [];

    // Service TypeScript file
    const tsContent = `export class ${serviceName} {
  async fetchData(): Promise<any> {
    // Implement your API calls here
    return {};
  }

  async postData(data: any): Promise<any> {
    // Implement your API calls here
    return {};
  }
}

export const ${serviceInstanceName} = new ${serviceName}();
`;
    const tsFile = path.join(servicePath, `${name}.service.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Test file
    if (!skipTests) {
      const testContent = `import {${serviceName}} from './${name}.service';

describe('${serviceName}', () => {
  let service: ${serviceName};

  beforeEach(() => {
    service = new ${serviceName}();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
`;
      const testFile = path.join(servicePath, `${name}.service.test.ts`);
      this.fileGenerator['writeFile'](testFile, testContent);
      files.push(testFile);
    }

    return files;
  }

  private generateUtil(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const utilPath = targetPath;
    this.fileGenerator['ensureDirectory'](utilPath);

    const utilName = this.fileGenerator['toCamelCase'](name);
    const files: string[] = [];

    // Util TypeScript file
    const tsContent = `/**
 * ${utilName} utility functions
 */

export const ${utilName} = {
  // Add your utility functions here
};
`;
    const tsFile = path.join(utilPath, `${name}.util.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Test file
    if (!skipTests) {
      const testContent = `import {${utilName}} from './${name}.util';

describe('${utilName}', () => {
  it('should be defined', () => {
    expect(${utilName}).toBeDefined();
  });
});
`;
      const testFile = path.join(utilPath, `${name}.util.test.ts`);
      this.fileGenerator['writeFile'](testFile, testContent);
      files.push(testFile);
    }

    return files;
  }

  private generateSlice(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const slicePath = path.join(targetPath, name);
    this.fileGenerator['ensureDirectory'](slicePath);

    const sliceName = this.fileGenerator['toCamelCase'](name);
    const typeName = this.fileGenerator['toPascalCase'](name);
    const files: string[] = [];

    // Slice TypeScript file
    const sliceContent = `import {PayloadAction, createSlice} from '@reduxjs/toolkit';
// TODO: Update this import path to match your project's store location
// Default: '../store' - adjust based on your project structure
import type {RootState} from '../store';

export interface ${typeName}State {
  // Define your state properties here
  data: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: ${typeName}State = {
  data: null,
  isLoading: false,
  error: null,
};

const ${sliceName}Slice = createSlice({
  name: '${sliceName}',
  initialState,
  reducers: {
    set${typeName}Data: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset${typeName}: state => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {set${typeName}Data, setLoading, setError, reset${typeName}} = ${sliceName}Slice.actions;

export default ${sliceName}Slice.reducer;

// Selectors
export const select${typeName}Data = (state: RootState) => state.${sliceName}.data;
export const select${typeName}Loading = (state: RootState) => state.${sliceName}.isLoading;
export const select${typeName}Error = (state: RootState) => state.${sliceName}.error;
`;
    const sliceFile = path.join(slicePath, `${sliceName}Slice.ts`);
    this.fileGenerator['writeFile'](sliceFile, sliceContent);
    files.push(sliceFile);

    // API Slice (RTK Query)
    const sliceUrl = `/${sliceName}`;
    const sliceIdUrl = `${sliceUrl}/\${id}`;
    const apiSliceContent = `// TODO: Update this import path to match your project's API slice location
// Default: '../apiSlice' - adjust based on your project structure (may not exist if RTK Query is not configured)
import {apiSlice} from '../apiSlice';

export const ${sliceName}ApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    get${typeName}: builder.query({
      query: (id: string) => \`${sliceIdUrl}\`,
    }),
    create${typeName}: builder.mutation({
      query: (data: any) => ({
        url: '${sliceUrl}',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {useGet${typeName}Query, useCreate${typeName}Mutation} = ${sliceName}ApiSlice;
`;
    const apiSliceFile = path.join(slicePath, `${sliceName}ApiSlice.ts`);
    this.fileGenerator['writeFile'](apiSliceFile, apiSliceContent);
    files.push(apiSliceFile);

    // Model file
    const modelContent = `export interface ${typeName} {
  id: string;
  // Add your model properties here
}
`;
    const modelFile = path.join(slicePath, `${sliceName}.model.ts`);
    this.fileGenerator['writeFile'](modelFile, modelContent);
    files.push(modelFile);

    return files;
  }
}
