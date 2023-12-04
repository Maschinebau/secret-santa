import dotenv from 'dotenv'
dotenv.config()
import { Telegraf, Markup, Scenes, session, Composer } from 'telegraf'
import { User, checkAuth, knex } from '../db/knexfile.js'
import { registrationScene } from './controllers/registerScene.js'
import { changePrefsScene } from './controllers/changePrefsScene.js'

const bot = new Telegraf(process.env.BOT_TOKEN)

const commands = `
/start - перезапуск бота.
/help - список команд.
/register - зарегистрироваться в тайном санте.
/set_prefs - изменить предпочтения.
/profile_info - статус профиля.
 `

//  старт бота

bot.start((ctx) => {
  const keyboard = Markup.keyboard([
    ['Команды бота', 'Статус профиля'],
    ['Зарегистрироваться', 'Изменить предпочтения']
  ]).resize()

  ctx.reply(
    `Здравствуйте, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец.'} . 
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

bot.hears(/^Изменить предпочтения$|^\/set_prefs$/i, (ctx) => ctx.scene.enter('changePrefs'))

// инфо о пользователе

bot.hears('Статус профиля', async (ctx) => {
  try {
    if (await checkAuth(ctx.message.from.username)) {
      const userDb = await knex('users').where('telegramLogin', ctx.message.from.username).first()
      const userInfo = User.deserializeFromDb(userDb)
      ctx.reply(`Имя - ${userInfo.name}.
Предпочтения - ${userInfo.preferences}.
      `)
    } else {
      ctx.reply(`Зарегистрируйтесь, чтобы смотреть профиль.`)
    }
  } catch {
    ctx.reply(`Ошибка при получении пользователя.`)
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
