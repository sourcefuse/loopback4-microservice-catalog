{
  "defaultEnv": "master",
  "master": {
    "driver": "pg",
    "host": {
      "ENV": "<%= upperDbKey %>_DB_HOST"
    },
    "port": {
      "ENV": "<%= upperDbKey %>_DB_PORT"
    },
    "user": {
      "ENV": "<%= upperDbKey %>_DB_USER"
    },
    "password": {
      "ENV": "<%= upperDbKey %>_DB_PASSWORD"
    },
    "database": {
      "ENV": "<%= upperDbKey %>_DB_DATABASE"
    }
  },
  "sql-file": true
}