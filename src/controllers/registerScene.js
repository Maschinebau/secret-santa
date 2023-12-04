import { Composer, Scenes } from 'telegraf'
import { knex, checkAuth } from '../../db/knexfile.js'

const setName = new Composer()
setName.on('text', async (ctx) => {
    if (await checkAuth(ctx.message.from.username)) {
      await ctx.reply('Вы уже зарегистрированы!')
      return ctx.scene.leave()
    } else {
      await ctx.reply('Как вас зовут?')
      ctx.wizard.state.data = {}
      return ctx.wizard.next()
    }
})

const setPrefs = new Composer()
setPrefs.on('text', async (ctx) => {
  try {
    await ctx.reply(`Напишите ваши предпочтения в одном сообщении.
Если их нет - поставьте прочерк.`)
    ctx.wizard.state.data.name = ctx.message.text
    return ctx.wizard.next()
  } catch (error) {
    ctx.reply(`Регистрация не завершена, что-то пошло не так.`)
    return ctx.scene.leave()
  }
})

const registerEnd = new Composer()
registerEnd.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data.preferences = ctx.message.text
    ctx.wizard.state.data.telegramLogin = ctx.message.from.username
    await knex('users').insert(ctx.wizard.state.data)
    await ctx.reply('Вы успешно зарегистрированы!')
  } catch {
    ctx.reply(`Регистрация не завершена, что-то пошло не так.`)
  }
  return ctx.scene.leave()
})

export const registrationScene = new Scenes.WizardScene('registration', setName, setPrefs, registerEnd)
