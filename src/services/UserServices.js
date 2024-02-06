import { User } from '../User.js'
import { db } from '../../db/db.js'

class UserService {
  constructor(database) {
    this.database = database
  }

  async checkAuth(id) {
    const currentUser = await this.database('users').where('telegram_id', id).first()
    return !!currentUser
  }

  async checkPairExist(id) {
    const currentUser = await this.database('users').where('telegram_id', id).first()
    const userPair = currentUser.pair_name
    return !!userPair
  }

  async getUsersFromDb() {
    const users = await database.select().from('users')
    const results = users.map((dbUser) => User.deserialize(dbUser))
    return results
  }

  async saveUserOnRegistration(userData) {
    await this.database('users').insert(userData)
  }

  async changeUserPrefs(username, prefs, ctx) {
    this.database('users').where('telegram_login', username).update({ preferences: prefs })
    ctx.reply('Пожелания успешно изменены.')
  }

  async clearDatabase() {
    try {
      await this.database('users').del()
      console.log('База данных успешно очищена')
    } catch (error) {
      console.error('Ошибка при очистке базы данных:', error)
    }
  }
}

export const userServiceInst = new UserService(db.knex)
