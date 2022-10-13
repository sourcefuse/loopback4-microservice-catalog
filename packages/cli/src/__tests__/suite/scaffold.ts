export const scaffoldSuite = [
  {
    name: 'scaffold command without any option',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: 'No',
      owner: 'tester',
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
      {
        input: {
          type: 'confirm',
          name: 'integrateWithBackstage',
          message: 'Do you want to include backstage integration files?',
          default: false,
        },
        output: 'No',
      },
      {
        input: {
          type: 'input',
          name: 'owner',
          message: 'owner of the repo',
        },
        output: 'tester',
      },
    ],
  },
  {
    name: 'scaffold command with name flag',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: 'No',
      owner: 'tester',
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
      {
        input: {
          type: 'confirm',
          name: 'integrateWithBackstage',
          message: 'Do you want to include backstage integration files?',
          default: false,
        },
        output: 'No',
      },
      {
        input: {
          type: 'input',
          name: 'owner',
          message: 'owner of the repo',
        },
        output: 'tester',
      },
    ],
  },
  {
    name: 'scaffold command with issuePrefix arg',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: 'No',
      owner: 'tester',
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
      {
        input: {
          type: 'confirm',
          name: 'integrateWithBackstage',
          message: 'Do you want to include backstage integration files?',
          default: false,
        },
        output: 'No',
      },
      {
        input: {
          type: 'input',
          name: 'owner',
          message: 'owner of the repo',
        },
        output: 'tester',
      },
    ],
  },
  {
    name: 'scaffold command with issuePrefix arg and random flag',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: 'No',
      owner: 'tester',
    },
    argv: ['test', '--issuePrefix', 'GH-1'],
    prompts: [
      {
        input: {
          type: 'confirm',
          name: 'integrateWithBackstage',
          message: 'Do you want to include backstage integration files?',
          default: false,
        },
        output: 'No',
      },
      {
        input: {
          type: 'input',
          name: 'owner',
          message: 'owner of the repo',
        },
        output: 'tester',
      },
    ],
  },
];
