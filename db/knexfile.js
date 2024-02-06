export const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './test-data.db'
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  useNullAsDefault: true
}

export default knexConfig
