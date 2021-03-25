// ==============================
// Base on https://github.com/commitizen/cz-conventional-changelog
// ==============================

const { types } = require('./types.json')

  /**
   * @typedef {{type: string; scope: string; subject: string; body: string; isBreaking: boolean; breakingBody: string; breaking: string; isIssueAffected: boolean; issuesBody: string; issues: string;}} Answers
   */

/** @type import('cz-format-extension').Config<Answers> */
module.exports = {
  questions({inquirer}) {
    return [
      {
        type: "list",
        name: "type",
        message: "Select type",
        choices: types
      },
      {
        type: 'input',
        name: 'scope',
        message:
          'What is the scope of this change (e.g. component or file name): (press enter to skip)\n'
      },
      {
        type: 'input',
        name: 'subject',
        message: "Write a short, imperative tense description of the change\n",
        validate: (subject) => subject.length === 0 ? 'subject is required' : true
      },
      {
        type: 'input',
        name: 'body',
        message: 'Provide a longer description of the change: (press enter to skip)\n',
      },
      {
        type: 'confirm',
        name: 'isBreaking',
        message: 'Are there any breaking changes?',
        default: false
      },
      {
        type: 'input',
        name: 'breakingBody',
        default: '-',
        message:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
        when: answers => answers.isBreaking && !answers.body
      },
      {
        type: 'input',
        name: 'breaking',
        message: 'Describe the breaking changes:\n',
        when: answers => answers.isBreaking
      },
      {
        type: 'confirm',
        name: 'isIssueAffected',
        message: 'Does this change affect any open issues?',
        default: false
      },
      {
        type: 'input',
        name: 'issuesBody',
        default: '-',
        message:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
        when: answers => answers.isIssueAffected && !answers.body && !answers.breakingBody
      },
      {
        type: 'input',
        name: 'issues',
        message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
        when: answers => answers.isIssueAffected,
        default: undefined,
        validate: (issues) => issues.length === 0 ? 'issues is required' : true
      }
    ]

  },
  commitMessage({answers}) {
    const scope = answers.scope ? `(${answers.scope})` : '';
    const head = `${answers.type}${scope}: ${answers.subject}`;
    const body = answers.body ? answers.body : false;
    const breaking = answers.breaking ? `BREAKING CHANGE: ${answers.breaking}` : '';
    const issues = answers.issues ? answers.issues : false;

    return [head, body, breaking, issues].join('\n\n')
  }
}