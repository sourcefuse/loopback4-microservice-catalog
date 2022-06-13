export const scaffoldSuite = [
  {
    name: 'scaffold command without any option',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
    },
    prompts: [
      {
        input: {
          type: 'string',
          name: 'name',
          message: 'name of the project',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          type: 'input',
          name: 'issuePrefix',
          message: 'Prefix to be used for issues(e.g. GH-)',
        },
        output: 'GH-1',
      },
    ],
  },
  {
    name: 'scaffold command with name flag',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
    },
    argv: ['test'],
    prompts: [
      {
        input: {
          type: 'input',
          name: 'issuePrefix',
          message: 'Prefix to be used for issues(e.g. GH-)',
        },
        output: 'GH-1',
      },
    ],
  },
  {
    name: 'scaffold command with issuePrefix arg',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
    },
    argv: ['--issuePrefix', 'GH-1'],
    prompts: [
      {
        input: {
          type: 'string',
          name: 'name',
          message: 'name of the project',
          required: true,
        },
        output: 'test',
      },
    ],
  },
  {
    name: 'scaffold command with issuePrefix arg and random flag',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
    },
    argv: ['test', '--issuePrefix', 'GH-1'],
    prompts: [],
  },
];
