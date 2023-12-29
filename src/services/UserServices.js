import { knex } from '../../db/knexfile.js'
import { User } from '../User.js'

// аутентификация

export const checkAuth = async (id) => {
  const currentUser = await knex('users').where('telegram_id', id).first()
  return !!currentUser
}

// проверка наличия пары

export const checkPairExist = async (id) => {
  const currentUser = await knex('users').where('telegram_id', id).first()
  const userPair = currentUser.pair_name
  return !!userPair
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
