import knexConfig from './knexfile.js'
import knex from 'knex'

class DatabaseWrapper {
  constructor(config) {
    this.knex = knex(config)
  }

  async testConnection() {
    try {
      await this.knex.raw('SELECT 1+1 as test').then(() => {
        console.log('Database connection successful.')
      })
    } catch (error) {
      throw new Error('Error connecting to the database:', error)
    }
  }

  async closeConnection() {
    await this.knex.destroy()
    console.log('Database connection closed.')
  }
}

export const db = new DatabaseWrapper(knexConfig)