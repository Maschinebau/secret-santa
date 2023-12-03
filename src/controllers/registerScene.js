import { Composer, Scenes } from 'telegraf'
import { knex } from '../../db/knexfile.js'

const setName = new Composer()
setName.on('text', async (ctx) => {
  await ctx.reply('Как вас зовут?')
  ctx.wizard.state.data = {}
  return ctx.wizard.next()
})

const setPrefs = new Composer()
setPrefs.on('text', async (ctx) => {
  await ctx.reply(`Напишите ваши предпочтения в одном сообщении.
Если их нет - поставьте прочерк.`)
  ctx.wizard.state.data.name = ctx.message.text
  return ctx.wizard.next()
})

const registerEnd = new Composer()
registerEnd.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data.preferences = ctx.message.text
    ctx.wizard.state.data.telegramLogin = ctx.message.from.username
    await knex('users').insert(ctx.wizard.state.data)
    // отладка
    // console.log(ctx.wizard.state.data)
    // console.log(knex)
    await ctx.reply('Вы успешно зарегистрированы!')
  } catch {
    ctx.reply(`Регистрация не завершена, что-то пошло не так.`)
  }
  return ctx.scene.leave()
})

export const registrationScene = new Scenes.WizardScene('registration', setName, setPrefs, registerEnd)
