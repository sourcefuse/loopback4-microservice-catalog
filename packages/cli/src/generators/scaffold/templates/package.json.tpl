{
  "name": "<%= name %>",
  "description": "This is the root package and will never be served via a web server",
  "private": true,
  "scripts": {
    "prepare": "husky install",
    "test": "lerna run test",
     "migrate": "npm run db:migrate --workspaces --if-present",
     "build": "npm run build --workspaces --if-present",
     "docker:build": "concurrently -m 6 npm:docker:build:*"
  },
  "devDependencies": {
    "@commitlint/cli": "^16.1.0",
    "@commitlint/config-conventional": "^16.0.0",
    "@commitlint/config-lerna-scopes": "^16.0.0",
    "commitizen": "^4.2.4",
    "concurrently": "^8.2.2",
    "cz-conventional-changelog": "^3.3.0",
    "cz-customizable": "^6.3.0",
    "husky": "^7.0.4",
    "lerna": "^7.3.0",
    "run-s": "^0.0.0"
  },
  "workspaces":["packages/*", "services/*", "facades/*"],
  "overrides":{
    "@commitlint/config-lerna-scopes":{
      "lerna":"^7.3.0"
    }
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-customizable"
    }
  }
}
