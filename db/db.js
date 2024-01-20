import knexConfig from './knexfile.js'
import knex from 'knex'

export const db = knex(knexConfig)

