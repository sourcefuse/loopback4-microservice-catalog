// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import Base from '../../command-base';
import {AnyObject} from '../../types';

export class ReactGenerate extends Base<{}> {
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
    await this.generate('react', ReactGenerate);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'react', []);
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
// Note: Adjust the import path for RootState based on your project structure
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
    const apiSliceContent = `// Note: Adjust the import path for apiSlice based on your project structure
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
