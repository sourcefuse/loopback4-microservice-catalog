export const scaffoldSuite = [
  {
    name: 'scaffold command without any option',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: 'No',
      owner: 'tester',
      description: 'test description',
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
      {
        input: {
          type: 'input',
          name: 'description',
          message: 'description of the repo',
        },
        output: 'test description',
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
      description: 'test description',
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
      {
        input: {
          type: 'input',
          name: 'description',
          message: 'description of the repo',
        },
        output: 'test description',
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
      description: 'test description',
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
      {
        input: {
          type: 'input',
          name: 'description',
          message: 'description of the repo',
        },
        output: 'test description',
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
      description: 'test description',
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
      {
        input: {
          type: 'input',
          name: 'description',
          message: 'description of the repo',
        },
        output: 'test description',
      },
    ],
  },
  {
    name: 'scaffold command with owner and description flags',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: 'No',
      owner: 'tester',
      description: 'test description',
    },
    argv: ['--owner', 'tester', '--description', 'test description'],
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
    ],
  },
  {
    name: 'scaffold command with integrateWithBackstage flag',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: true,
      owner: 'tester',
      description: 'test description',
    },
    argv: ['--integrateWithBackstage'],
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
          type: 'input',
          name: 'owner',
          message: 'owner of the repo',
        },
        output: 'tester',
      },
      {
        input: {
          type: 'input',
          name: 'description',
          message: 'description of the repo',
        },
        output: 'test description',
      },
    ],
  },
  {
    name: 'scaffold command with all flags',
    options: {
      name: 'test',
      issuePrefix: 'GH-1',
      integrateWithBackstage: true,
      owner: 'tester',
      description: 'test description',
    },
    argv: [
      'test',
      '--owner',
      'tester',
      '--description',
      'test description',
      '--issuePrefix',
      'GH-1',
      '--integrateWithBackstage',
    ],
    prompts: [],
  },
];
