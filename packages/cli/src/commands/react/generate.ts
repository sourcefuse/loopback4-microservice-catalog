// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class ReactGenerate extends Base<{}> {
  private readonly fileGen = new FileGenerator();

  static readonly description =
    'Generate React components, hooks, contexts, pages, and other artifacts.';
  static readonly mcpDescription =
    'Generates React components, hooks, contexts, pages, utilities, slices, and services based on ARC conventions.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    type: flags.enum({
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
    }),
    path: flags.string({description: 'Target path for the artifact'}),
    skipTests: flags.boolean({description: 'Skip test file generation'}),
  };

  static readonly args = [{name: 'name', description: 'Artifact name'}];

  static readonly mcpFlags = {
    workingDir: flags.string({description: 'React project root directory'}),
  };

  async run(): Promise<void> {
    const {args, flags: opts} = this.parse(ReactGenerate);
    const name =
      args.name ?? (await this.promptFor('name', 'Enter artifact name'));
    const type = opts.type ?? (await this.promptForType());
    const result = await this.generateArtifact({name, ...opts, type});
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);
      const instance = new ReactGenerate(
        [],
        {} as IConfig,
        {} as PromptFunction,
      );
      const result = await instance.generateArtifact(inputs);
      return {
        content: [{type: 'text' as const, text: result, isError: false}],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {type: 'text' as const, text: `Error: ${msg}`, isError: true},
        ],
      };
    } finally {
      process.chdir(cwd);
    }
  }

  // ---------- CORE ----------

  private async generateArtifact(inputs: AnyObject): Promise<string> {
    const {name, type, path: targetPath, skipTests} = inputs;
    const root = this.fileGen['getProjectRoot']();
    const dir = path.join(root, targetPath || this.resolveDir(type));
    this.fileGen['ensureDirectory'](dir);

    const generator = this.generators[type];
    if (!generator) throw new Error(`Unsupported artifact type: ${type}`);

    const files = generator.call(this, name, dir, skipTests);
    return `✅ Generated ${type} '${name}' at:\n${files
      .map(f => `  - ${f}`)
      .join('\n')}`;
  }

  private readonly generators: Record<
    string,
    (name: string, dir: string, skipTests?: boolean) => string[]
  > = {
    component: this.makeComponent,
    hook: this.makeHook,
    context: this.makeContext,
    page: this.makePage,
    service: this.makeService,
    util: this.makeUtil,
    slice: this.makeSlice,
  };

  // ---------- PROMPTS ----------

  private async promptFor(name: string, message: string): Promise<string> {
    const {value} = await this.prompt([
      {
        type: 'input',
        name: 'value',
        message,
        validate: (v: string) => !!v || `${name} is required`,
      },
    ]);
    return value;
  }

  private async promptForType(): Promise<string> {
    const {value} = await this.prompt([
      {
        type: 'list',
        name: 'value',
        message: 'Select artifact type',
        choices: Object.keys(this.generators),
      } as Record<string, unknown>,
    ]);
    return value;
  }

  // ---------- DIRECTORY MAP ----------

  private resolveDir(type: string): string {
    const dirs: Record<string, string> = {
      component: 'src/Components',
      hook: 'src/Hooks',
      context: 'src/Providers',
      page: 'src/Pages',
      slice: 'src/redux',
    };
    return dirs[type] || 'src';
  }

  // ---------- GENERATORS ----------

  private makeComponent(
    name: string,
    dir: string,
    skipTests?: boolean,
  ): string[] {
    const comp = this.fileGen['toPascalCase'](name);
    const code = `
import { Box } from '@mui/material';
import React from 'react';

export interface ${comp}Props {}

const ${comp}: React.FC<${comp}Props> = () => (
  <Box sx={{ p: 2 }}>
    <p>${comp} Component</p>
  </Box>
);

export default ${comp};
`;
    return this.writeFiles(dir, comp, code, skipTests, 'tsx');
  }

  private makeHook(name: string, dir: string, skipTests?: boolean): string[] {
    const hook = name.startsWith('use')
      ? name
      : `use${this.fileGen['toPascalCase'](name)}`;
    const code = `
import { useState, useEffect } from 'react';

export const ${hook} = () => {
  const [state, setState] = useState();
  useEffect(() => {}, []);
  return { state, setState };
};
`;
    return this.writeFiles(dir, hook, code, skipTests);
  }

  private makeContext(name: string, dir: string): string[] {
    const ctx = this.fileGen['toPascalCase'](name);
    const contextDir = path.join(dir, `${ctx}Context`);
    const code = `
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ${ctx}State {}
interface ${ctx}Value { state: ${ctx}State; setState: React.Dispatch<React.SetStateAction<${ctx}State>>; }

const ${ctx}Context = createContext<${ctx}Value | undefined>(undefined);

export const ${ctx}Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<${ctx}State>({});
  return <${ctx}Context.Provider value={{ state, setState }}>{children}</${ctx}Context.Provider>;
};

export const use${ctx} = (): ${ctx}Value => {
  const context = useContext(${ctx}Context);
  if (!context) throw new Error('use${ctx} must be used within ${ctx}Provider');
  return context;
};
`;
    return this.writeFiles(
      contextDir,
      `${ctx}Context`,
      code,
      true,
      'tsx',
      true,
    );
  }

  private makePage(name: string, dir: string, skipTests?: boolean): string[] {
    const page = this.fileGen['toPascalCase'](name);
    const pageDir = path.join(dir, name);
    const code = `
import { Box, Typography } from '@mui/material';
import React from 'react';

const ${page}Page: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">${page} Page</Typography>
  </Box>
);

export default ${page}Page;
`;
    return this.writeFiles(pageDir, page, code, skipTests, 'tsx');
  }

  private makeService(
    name: string,
    dir: string,
    skipTests?: boolean,
  ): string[] {
    const service = this.fileGen['toPascalCase'](name);
    const camel = this.fileGen['toCamelCase'](name);
    const code = `
export class ${service}Service {
  async fetchData(): Promise<unknown> { return {}; }
  async postData(data: unknown): Promise<unknown> { return {}; }
}

export const ${camel}Service = new ${service}Service();
`;
    return this.writeFiles(dir, `${name}.service`, code, skipTests);
  }

  private makeUtil(name: string, dir: string, skipTests?: boolean): string[] {
    const util = this.fileGen['toCamelCase'](name);
    return this.writeFiles(
      dir,
      `${name}.util`,
      `export const ${util} = {};`,
      skipTests,
    );
  }

  private makeSlice(name: string, dir: string): string[] {
    const slice = this.fileGen['toCamelCase'](name);
    const type = this.fileGen['toPascalCase'](name);
    const sliceDir = path.join(dir, name);
    const code = `
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ${type}State { data: unknown; isLoading: boolean; error: string | null; }
const initialState: ${type}State = { data: null, isLoading: false, error: null };

const ${slice}Slice = createSlice({
  name: '${slice}',
  initialState,
  reducers: {
    set${type}Data: (s, a: PayloadAction<unknown>) => { s.data = a.payload; },
    setLoading: (s, a: PayloadAction<boolean>) => { s.isLoading = a.payload; },
    setError: (s, a: PayloadAction<string | null>) => { s.error = a.payload; },
    reset${type}: () => initialState,
  },
});

export const { set${type}Data, setLoading, setError, reset${type} } = ${slice}Slice.actions;
export default ${slice}Slice.reducer;
export const select${type}Data = (s: RootState) => s.${slice}.data;
`;
    return this.writeFiles(sliceDir, `${slice}Slice`, code, true);
  }

  // ---------- UTIL ----------

  private writeFiles(
    dir: string,
    name: string,
    content: string,
    skipTests?: boolean,
    ext = 'ts',
    skipIndex = false,
  ): string[] {
    const files: string[] = [];
    this.fileGen['ensureDirectory'](dir);

    const mainFile = path.join(dir, `${name}.${ext}`);
    this.fileGen['writeFile'](mainFile, content.trim());
    files.push(mainFile);

    if (!skipIndex) {
      const indexFile = path.join(dir, 'index.ts');
      this.fileGen['writeFile'](indexFile, `export * from './${name}';`);
      files.push(indexFile);
    }

    if (!skipTests) {
      const testFile = path.join(dir, `${name}.test.${ext}`);
      const testCode = `describe('${name}', () => it('should be defined', () => expect(true).toBe(true)));`;
      this.fileGen['writeFile'](testFile, testCode);
      files.push(testFile);
    }

    return files;
  }
}
