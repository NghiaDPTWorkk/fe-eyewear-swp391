export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(KAN-\d+)\s+(\w+)(?:\((.+)\))?:\s+(.+)$/,
      headerCorrespondence: ['ticket', 'type', 'scope', 'subject']
    }
  },
  plugins: [
    {
      rules: {
        'jira-ticket-format': (parsed) => {
          const { header } = parsed
          const jiraPattern = /^KAN-\d+\s+/
          if (!jiraPattern.test(header)) {
            return [
              false,
              'Commit message must start with JIRA ticket (e.g., "KAN-123 feat: description")'
            ]
          }
          return [true, '']
        }
      }
    }
  ],
  rules: {
    'jira-ticket-format': [2, 'always'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']
    ],
    'type-case': [0],
    'type-empty': [0],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  }
}
