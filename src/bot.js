import dotenv from 'dotenv'
dotenv.config()
import { Telegraf, Markup, Scenes, session, Composer } from 'telegraf'
import { knex } from '../db/knexfile.js'
import { registrationScene } from './controllers/registerScene.js'

const bot = new Telegraf(process.env.BOT_TOKEN)

const commands = `
/start - перезапуск бота
/help - список команд
/register - зарегистрироваться в тайном санте
/set_prefs - перезаписать предпочтения
/show_players - список участников
 `

//  старт бота

bot.start((ctx) => {
  const keyboard = Markup.keyboard([['Команды бота', 'Статус регистрации'], ['Зарегистрироваться']]).resize()

  ctx.reply(
    `Здравствуйте, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'} . 
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

const stage = new Scenes.Stage([registrationScene])
bot.use(session())
bot.use(stage.middleware())

bot.hears(/^(Зарегистрироваться|\/register)$/i, (ctx) => ctx.scene.enter('registration'))

// для неопределенного текста

bot.on('text', (ctx) => {
  const unknownTextResponse = 'Извините, я маленький, и токое не понимаю 👉🏻👈🏻';

  ctx.reply(unknownTextResponse);
});

// 

bot.command('test', (ctx) => {})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
