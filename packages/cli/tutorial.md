### CLI Tutorial

For specifics of configuring a particular service, please refer to that service's documentation. The purpose of this guide is to provide a general outline for installation and setting up a new microservices-based API codebase. To illustrate the process, we will be using one of our services that is used for authentication. It's worth noting that all services utilize `dotenv` and `dotenv-extended` to load their environment configurations.

Following are the steps to get started with it:

#### Step 1: Install NodeJS

Install the latest LTS version from here: https://nodejs.org/en/download/.

#### Step 2: Install Loopback CLI

LoopBack provides a very useful command line utility that help in easily developing loopback applications, models, services, etc. as a boilerplate, which saves a lot of time.
So, go ahead and install [@loopback/cli](https://www.npmjs.com/package/@loopback/cli).

```sh
npm install -g @loopback/cli
```

#### Step 3: Install Sourceloop CLI

Similar to LoopBack, Sourceloop also provides a useful command line utility that helps in the quick scaffolding of monorepo (for microservices), individual services, extensions, etc. So, let’s install [@sourceloop/cli](https://www.npmjs.com/package/@sourceloop/cli).

```sh
npm install -g @sourceloop/cli
```

#### Step 4: Scaffold a Monorepo for Microservices

We recommend using a monorepo strategy for maintaining all the microservices, as it helps avoid the clutter of too many repositories to manage and maintain.

We will first scaffold a monorepo with a basic structure and with [Lerna](https://lerna.js.org/) installed as a monorepo manager.

```sh
sl scaffold my-project
```

You will be asked several prompts, as follows:

```sh
? Prefix to be used for issues(e.g. GH-) myp
? Do you want to include backstage integration files? No
? owner of the repo: Samarpan
? description of the repo: A sample project based on Sourceloop
```

- Prompt #1 – Prefix is used by scaffold to set up commit message linting, checks using [commitizen](https://commitizen-tools.github.io/commitizen/) to ensure [conventional commit message guidelines](https://www.conventionalcommits.org/en/v1.0.0/) are followed. This could be your project key from Jira using which you can also integrate [Smart Commits](https://support.atlassian.com/jira-cloud-administration/docs/enable-smart-commits/) of Jira.
- Prompt #2 – Sourceloop provides backstage integration too. But this is optional.
- Prompt #3 – Author/Owner of the repo. This will go into `package.json`.
- Prompt #4 – Description of the repo. This will go into `package.json`.

After this, it will take a few minutes to set everything up, once that is done, you will see a folder structure generated like below:

```
MY-PROJECT
├── .github
├── .husky
├── facades
├── packages
├── services
├── .cz-config.js
├── .gitignore
├── commitlint.config.js
├── DEVELOPING.md
├── lerna.json
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

As can be seen above, scaffold has initialized and set up a lot, such as:

1. GitHub PR template inside `.github`
2. Conventional commits enablement using commitizen (`.cz-config.js`), commitlint (`commitlint-config.js`) and husky for githooks.
3. `.gitignore` for ignoring files from source code. Important for secure coding and keeping the repo clean on SCM (git)
4. `lerna.json` which contains the setup for lerna commands. Lerna is going to be our monorepo manager and build tool going forward. It is one of the most popular monorepo managers in the industry, used by Jest, NestJS, LoopBack, and Nx.
5. `package.json` and `package-lock.json` for npm to work.
6. Three folders named `facades`, `packages` and `services`:
   - Facades will hold facade microservices. These are based on aggregator patterns in microservices composition
   - Packages will hold a reusable library, extensions etc. which are needed by multiple microservices
   - Services will hold the actual microservices and will always be completely independent of their own database i.e. one DB per service pattern.

#### Step 5: Create an Authentication Microservice

Now it’s time to set up our first microservice – auth-service. Run the following command in the project folder:

```sh
sl microservice auth-service
```

Again, you will be asked several prompts, as follows:

![prompts](https://i.imgur.com/3svts17.png)

- Prompt #1 – Whether this is a facade microservice or a base microservice
- Prompt #2 – Whether this microservice is based on an Sourceloop microservice or is an independent one like the project-management-service in our list above. We selected "Yes" because we are using Sourceloop's authentication service.
- Prompt #3 – Select which Sourceloop microservice you want from the list if "Yes" was selected in the previous prompt.

![services selection](https://i.imgur.com/iqnjd0b.png)

- Prompt #4 – Unique prefix for docker images built for this service. Yes, it already supports docker containers and their CI/CD-related commands are part of package.json scripts.
- Prompt #5 – Datasource name for DB connection.
- Prompt #6 – Datasource type. ARC currently supports PostgreSQL and MySQL.
- Prompts #7 & #8 – Whether to utilize underlying database migrations provided by ARC or use custom migrations. In case of custom migrations, a new folder will be created inside the packages folder named migrations. Custom migrations provide more flexibility and are recommended for production applications.
- Prompts #9 & #10 – Description and class name to configure in service.
- Prompt #11 – Setup features needed. These features are provided by LoopBack CLI itself and Sourceloop CLI just exposes it i.e., all the feature support is based on LoopBack.

Once this is done, you will be see something like this:

![sevices created](https://i.imgur.com/Vktb4Lg.png)

That’s all! You are almost ready to run your microservice with pre-built APIs.

#### Step 6: Set up Environment Variables

The final step before running your server is to set up your environment variables in the `.env` file. All of the possible environment variables available are defined in a file `.env.example`. Referring to that, you can create a `.env` file at the same level and provide values.

```
MY-PROJECT
├── facades
├── packages
├── services
│   └── auth-service
│       ├── (...other files)
│       ├── .env.example
│       ├── .env.defaults
│    👉🏻 └── .env
├── (...other files)
```

### Step 7: Start the Server

Go to the terminal and change the directory into your service folder:

```sh
npm start
```

You'll see a message saying `Server is running at http://[::1]:3000/` open this url in your browser and you should see something like this:

![auth services started](https://i.imgur.com/51SxnsF.png)

Voila! The service is up and running. As you can see, this service comes with openapi spec, an openapi explorer and monitoring enabled by default.

Clicking on `/explorer` opens up the following:

![explorer page](https://i.imgur.com/45tLQxi.png)

You have even got ready-made APIs already connected with DB.

Clicking on `/monitor` opens up swagger-stats, which provides monitoring capabilities to the microservice:

![monitor page](https://i.imgur.com/yQsbwbv.png)

As you can see, with just a few basic commands and steps, you are able to scaffold an entire repo and one pre-built microservice. Similarly, you can add any other Sourceloop microservice as well using the `sl microservice {{service name}}` command.

#### DataSources and Migrations

ARC API Services can support any Loopback 4 [DataSource](https://loopback.io/doc/en/lb4/DataSource.html). While you may see existing `DataSources`, it is not mandatory to use them.

The migrations required for this service are processed during the installation automatically if you set the `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.
