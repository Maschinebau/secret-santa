import dotenv from 'dotenv'
import { Telegraf, Markup, Scenes, session } from 'telegraf'
import { registrationScene } from './controllers/registerScene.js'
import { changePrefsScene } from './controllers/changePrefsScene.js'
import { User } from './User.js'
import { userServiceInst } from './services/UserServices.js'
import { pairGenerator } from './controllers/pairGenerator.js'
import { db } from '../db/db.js'

dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN)

const commands = `
/start - перезапуск бота.
/help - список команд.
/register - зарегистрироваться в тайном санте.
/set_prefs - изменить пожелания.
/profile_info - статус профиля.
/get_pair - узнать пару.
 `

//  старт бота

bot.start((ctx) => {
  const keyboard = Markup.keyboard([
    ['Команды бота', 'Статус профиля'],
    ['Зарегистрироваться', 'Изменить пожелания'],
    ['Узнать мою пару']
  ]).resize()

  const firstName = ctx.message?.from?.first_name ?? 'Незнакомец'

  ctx.reply(
    `Здравствуйте, ${firstName}. 
Выберите действие:`,
    keyboard
  )
})

// вызов подсказки

bot.help((ctx) => ctx.reply(commands))
bot.hears('Команды бота', (ctx) => {
  bot.help(ctx.reply(commands))
})

// регистрация

const stage = new Scenes.Stage([registrationScene, changePrefsScene])
bot.use(session())
bot.use(stage.middleware())

bot.hears(/^(Зарегистрироваться|\/register)$/i, (ctx) => ctx.scene.enter('registration'))

// смена предпочтений

bot.hears(/^(Изменить|\/set_prefs)\sпожелания$/i, (ctx) => ctx.scene.enter('changePrefs'))

// инфо о пользователе

bot.hears(/^(Статус профиля|\/profile_info)$/i, async (ctx) => {
  try {
    const id = ctx.message.from.id
    if (await userServiceInst.checkAuth(id)) {
      const userDb = await db('users').where('telegram_id', id).first()
      const userInfo = User.deserializeFromDb(userDb)
      ctx.reply(`Имя: ${userInfo.name}.
Пожелания: ${userInfo.preferences}.
      `)
    } else {
      ctx.reply(`Зарегистрируйтесь, чтобы смотреть профиль.`)
    }
  } catch {
    ctx.reply(`Ошибка при получении пользователя.`)
  }
})

// узнать свою пару

bot.hears(/^(\/get_pair|Узнать мою пару)$/i, async (ctx) => {
  try {
    const id = ctx.message.from.id
    if (await userServiceInst.checkAuth(id)) {
      if (await userServiceInst.checkPairExist(id)) {
        const userDb = await db('users').where('telegram_id', id).first()
        const pairName = userDb.pair_name
        const userPairDb = await db('users').where('name', pairName).first()
        const pairPreferences = userPairDb.preferences
        ctx.reply(`Имя пары: ${userDb.pair_name}.
Пожелания: ${pairPreferences}.`)
      } else {
        ctx.reply(`У вас ещё нет пары.`)
      }
    } else {
      ctx.reply(`Зарегистрируйтесь, чтобы участвовать.`)
    }
  } catch {
    ctx.reply(`Ошибка при получении пары.`)
  }
})

// обработка отмены действия

bot.action('btn_1', async (ctx) => {
  try {
    await ctx.answerCbQuery()
    ctx.reply(`Действие отменено.`)
    return ctx.scene.leave()
  } catch (e) {
    console.log(e)
  }
})

// для неопределенного текста

bot.on('text', (ctx) => {
  ctx.reply('Извините, я маленький, и токое не понимаю 👉🏻👈🏻')
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

const test = async () => {
  const users = [
    {
      name: 'Саня',
      preferences: 'Preferences1',
      email: 'user1@example.com',
      telegram_login: 'user1',
      telegram_id: '123456',
      pair_name: ''
    },
    {
      name: 'Дав',
      preferences: 'Preferences2',
      email: 'user2@example.com',
      telegram_login: 'user2',
      telegram_id: '789012',
      pair_name: ''
    },
    {
      name: 'Жека',
      preferences: 'Preferences1',
      email: 'user1@example.com',
      telegram_login: 'user1',
      telegram_id: '123456',
      pair_name: ''
    },
    {
      name: 'Дрюс',
      preferences: 'Preferences2',
      email: 'user2@example.com',
      telegram_login: 'user2',
      telegram_id: '789012',
      pair_name: ''
    },
    {
      name: 'Катя',
      preferences: 'Preferences1',
      email: 'user1@example.com',
      telegram_login: 'user1',
      telegram_id: '123456',
      pair_name: ''
    },
    {
      name: 'Некит',
      preferences: 'Preferences2',
      email: 'user2@example.com',
      telegram_login: 'user2',
      telegram_id: '789012',
      pair_name: ''
    },
    {
      name: 'Настя',
      preferences: 'Preferences2',
      email: 'user2@example.com',
      telegram_login: 'user2',
      telegram_id: '789012',
      pair_name: ''
    },
    {
      name: 'Егор',
      preferences: 'Preferences1',
      email: 'user1@example.com',
      telegram_login: 'user1',
      telegram_id: '123456',
      pair_name: ''
    },
    {
      name: 'Ксюша',
      preferences: 'Preferences2',
      email: 'user2@example.com',
      telegram_login: 'user2',
      telegram_id: '789012',
      pair_name: ''
    }
  ]

  try {
    const tableExists = await db.schema.hasTable('users')

    if (tableExists) {
      for (const user of users) {
        await db('users').insert(user)
      }

      console.log('Пользователи успешно добавлены в базу данных!')
    } else {
      console.log('Таблица "users" не существует')
    }
  } catch (error) {
    console.error('Ошибка при добавлении пользователей в базу данных:', error)
  }
}

// test()

// pairGenerator()

// clearDatabase()
