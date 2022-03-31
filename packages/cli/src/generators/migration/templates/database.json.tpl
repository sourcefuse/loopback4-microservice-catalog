{
    "defaultEnv": "master",
    "master": {
      "driver": "<%= connector -%>",
      "host": {
        "ENV": "<%= name -%>_DB_HOST"
      },
      "port": {
        "ENV": "<%= name -%>_DB_PORT"
      },
      "user": {
        "ENV": "<%= name -%>_DB_USER"
      },
      "password": {
        "ENV": "<%= name -%>_DB_PASSWORD"
      },
      "database": {
        "ENV": "<%= name -%>_DB_DATABASE"
      }
    },
    "sql-file": true
}
