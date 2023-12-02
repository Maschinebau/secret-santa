export const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data.db'
  },
  useNullAsDefault: true
})

const createBd = async () => {
  await knex.schema
  .createTableIfNotExists('users', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.string('preferences')
    table.string('email')
    table.string('telegramLogin')
    table.string('pairName')
  })
}

createBd()


// exports.up = function (knex) {
//   return knex.schema
//     .createTable('users', function (table) {
//       table.string('id').primary()
//       table.string('name')
//       table.string('preferences')
//       table.string('email')
//       table.string('telegramLogin')
//       table.string('pairName')
//     })
//     .then(() => {
//       console.log('Таблица users создана')
//     })
//     .finally(() => {
//       knex.destroy()
//     })
// }

// exports.down = function (knex) {
//   return knex.schema.dropTableIfExists('users')
// }

class User {
  constructor(id, name, preferences, email, telegramLogin, pairName) {
    this.id = id
    this.name = name
    this.preferences = preferences
    this.email = email
    this.telegramLogin = telegramLogin
    this.pairName = pairName
  }

  static deserialize(id, name, preferences, email, telegramLogin, pairName) {
    return new User((id, name, preferences, email, telegramLogin, pairName))
  }
}

const user = User.deserialize()
const resultsFromDb = []

// 1: /register - регистрация
// 2: /listUsers - проверка регистрации(вывести пользователей в список)
// 3: /randomize - запуск рандомизатора
//  3.1 генерация пар в ответном сообщении(массив)
//  3.2 сохранить присвоенные пары в дб по имени
//  3.3 отправление сообщений
// 4: /pair получение пары для пользователя
