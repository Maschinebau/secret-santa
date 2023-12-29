import _Knex from 'knex'
import { up } from './migrations/init.js'

export const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './db/test-data.db'
  },
  migrations: {
    directory: './db/migrations'
  },
  useNullAsDefault: true
}

export const knex = _Knex(knexConfig)

// up()

// class DatabaseWrapper {
//   constructor() {
//       this.knex = _knex
//   }
// }

// const databaseWrapper = new DatabaseWrapper()



