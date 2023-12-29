import { knex } from '../knexfile.js'


const createBd = async () => {
  const tableExists = await knex.schema.hasTable('users')
  if (!tableExists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('preferences')
      table.string('email')
      table.string('telegram_login')
      table.string('telegram_id')
      table.string('pair_name')
    })
  }
}
// createBd()

export async function up(knex) {
  await createBd(knex)
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users')
}
