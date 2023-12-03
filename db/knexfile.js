import _knex from 'knex'

export const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './db/test-data.db'
  },
  useNullAsDefault: true
}

export const knex = _knex(knexConfig)

const createBd = async () => {
  const tableExists = await knex.schema.hasTable('users')
  if (!tableExists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('preferences')
      table.string('email')
      table.string('telegramLogin')
      table.string('pairName')
    })
  }
}

createBd()


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

// не добавляет в бд
;(async function insert() {
  try {
    await knex('users').insert({ name: 'alex', email: '2024@mail.ru' })
    console.log('Запись успешно добавлена')
  } catch (error) {
    console.error(error)
  } finally {
    knex.destroy()
  }
})()

// 1: /register - регистрация
// 2: /listUsers - проверка регистрации(вывести пользователей в список)
// 3: /randomize - запуск рандомизатора
//  3.1 генерация пар в ответном сообщении(массив)
//  3.2 сохранить присвоенные пары в дб по имени
//  3.3 отправление сообщений
// 4: /pair получение пары для пользователя
