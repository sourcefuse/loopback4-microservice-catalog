{
  "packages": ["packages/*", "services/*", "facades/*"],
  "command": {
    "bootstrap": {
      "concurrency": 4,
      "forceLocal": true
    },
    "version": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    },
    "run": {
      "concurrency": 3
    },
    "clean": {
      "loglevel": "silent",
      "concurrency": 8,
      "yes": true
    }
  },
  "ignoreChanges": ["**/__fixtures__/**", "**/__tests__/**", "**/*.md"],
  "version": "independent"
}