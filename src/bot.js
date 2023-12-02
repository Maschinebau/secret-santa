require('dotenv').config()
const { Telegraf } = require('telegraf')
const knex = require('knex')

const bot = new Telegraf(process.env.BOT_TOKEN)

const commands = `
/start - перезапуск бота
/help - список команд
/register - зарегистрироваться в тайном санте
/setPrefs - перезаписать предпочтения
/showPlayers - список участников
 `

bot.start((ctx) => {
  ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'} . 
Запусти команду /register, чтобы начать участвовать.
Команда /help покажет все доступные команды.`)
})
bot.help((ctx) => ctx.reply(commands))

bot.command('register', async (ctx) => {
  try {

    await knex('users').insert({ telegramLogin: ctx.message.from.username })
  } catch (e) {
    console.error(e)
  }
  // console.log(ctx.from)
})

bot.command('test', (ctx) => {})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
