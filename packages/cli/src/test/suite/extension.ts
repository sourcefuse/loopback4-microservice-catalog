export const extensionSuite = [
  {
    name: 'extension command without any option',
    options: {
      name: 'test',
    },
    prompts: [
      {
        input: {
          type: 'string',
          name: 'name',
          message: 'name of the extension',
          required: true,
        },
        output: 'test',
      },
    ],
  },
];
