export const up = function (knex) {
  return knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.string('preferences')
    table.string('email')
    table.string('telegram_login')
    table.string('telegram_id')
    table.string('pair_name')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('users')
}
