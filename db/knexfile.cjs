// Update with your config settings.

module.exports = {
  development: {
    client: 'postgres',
    connection: {
      database: 'priotix',
      user: 'postgres',
      port: 5432,
      password: 'qwerty1'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgres',
    connection: {
      database: 'px_twitter',
      user: 'postgres',
      port: 5432,
      password: 'qwerty1',
      host: 'db'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
