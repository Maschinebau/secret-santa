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
      table.string('telegramId')
      table.string('pairName')
    })
  }
}

createBd()

export class User {
  constructor(id, name, preferences, email, telegramLogin, telegramId, pairName) {
    this.id = id
    this.name = name
    this.preferences = preferences
    this.email = email
    this.telegramLogin = telegramLogin
    this.telegramId = telegramId
    this.pairName = pairName
  }

  static deserialize({ id, name, preferences, email, telegramLogin, telegramId, pairName }) {
    return new User(id, name, preferences, email, telegramLogin, telegramId, pairName)
  }

  static deserializeFromDb(dbUser) {
    return new User(
      dbUser.id,
      dbUser.name,
      dbUser.preferences,
      dbUser.email,
      dbUser.telegramLogin,
      dbUser.telegramId,
      dbUser.pairName
    )
  }
}

// получим список пользователей из дб

async function getUsersFromDb() {
  const users = await knex.select().from('users')
  const results = users.map((dbUser) => User.deserialize(dbUser))
  return results
}

// console.log(await getUsersFromDb())

// сброс бд

const clearDatabase = async () => {
  try {
    await knex('users').del()
    console.log('База данных успешно очищена')
  } catch (error) {
    console.error('Ошибка при очистке базы данных:', error)
  }
}

// clearDatabase()

// аутентификация

export const checkAuth = async (id) => {
  const currentUser = await knex('users').where('telegramId', id).first()
  return !!currentUser
}

// проверка наличия пары

export const checkPairExist = async (id) => {
  const currentUser = await knex('users').where('telegramId', id).first()
  const userPair = currentUser.pairName
  return !!userPair
}

// 1: /register - регистрация
// 2: /listUsers - проверка регистрации(вывести пользователей в список)
// 3: /randomize - запуск рандомизатора
//  3.1 генерация пар в ответном сообщении(массив)
//  3.2 сохранить присвоенные пары в дб по имени
//  3.3 отправление сообщений
// 4: /pair получение пары для пользователя
