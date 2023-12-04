import dotenv from 'dotenv'
dotenv.config()
import { Telegraf, Markup, Scenes, session, Composer } from 'telegraf'
import { User, checkAuth, checkPairExist, knex } from '../db/knexfile.js'
import { registrationScene } from './controllers/registerScene.js'
import { changePrefsScene } from './controllers/changePrefsScene.js'

const bot = new Telegraf(process.env.BOT_TOKEN)

const commands = `
/start - перезапуск бота.
/help - список команд.
/register - зарегистрироваться в тайном санте.
/set_prefs - изменить пожелания.
/profile_info - статус профиля.
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
    if (await checkAuth(id)) {
      const userDb = await knex('users').where('telegramId', id).first()
      const userInfo = User.deserializeFromDb(userDb)
      ctx.reply(`Имя - ${userInfo.name}.
Пожелания - ${userInfo.preferences}.
      `)
    } else {
      ctx.reply(`Зарегистрируйтесь, чтобы смотреть профиль.`)
    }
  } catch {
    ctx.reply(`Ошибка при получении пользователя.`)
  }
})

// узнать свою пару

bot.hears('Узнать мою пару', async (ctx) => {
  try {
    const id = ctx.message.from.id
    if (await checkAuth(id)) {
      if (await checkPairExist(id)) {
        const userDb = await knex('users').where('telegramId', id).first()
        const userInfo = User.deserializeFromDb(userDb)
        ctx.reply(`Имя пары - ${userInfo.pairName}.
Пожелания - ${userInfo.preferences}.`)
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

// для неопределенного текста

bot.on('text', (ctx) => {
  ctx.reply('Извините, я маленький, и токое не понимаю 👉🏻👈🏻')
})

//

bot.command('test', (ctx) => {})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
