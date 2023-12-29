import { Composer, Markup, Scenes } from 'telegraf'
import { knex } from '../../db/knexfile.js'
import { checkAuth } from '../services/UserServices.js'

const getPrefs = new Composer()
getPrefs.on('text', async (ctx) => {
  try {
    if (await checkAuth(ctx.message.from.id)) {
      await ctx.replyWithHTML(
        `Напишите ваши пожелания:`,
        Markup.inlineKeyboard([[Markup.button.callback('Отмена', 'btn_1')]])
      )
      ctx.wizard.state.data = {}
      return ctx.wizard.next()
    } else {
      ctx.reply('Зарегистрируйтесь, чтобы указать пожелания.')
      return ctx.scene.leave()
    }
  } catch {
    ctx.reply('Что-то пошло не так.')
    return ctx.scene.leave()
  }
})

const setPrefs = new Composer()
setPrefs.on('text', async (ctx) => {
  try {
    const regex = /^отмена$/i
    if (regex.test(ctx.message.text)) {
      ctx.reply('Смена пожеланий отменена.')
      return ctx.scene.leave()
    } else {
      ctx.wizard.state.data.preferences = ctx.message.text
      await knex('users')
        .where('telegram_login', ctx.message.from.username)
        .update({ preferences: ctx.wizard.state.data.preferences })
      ctx.reply('Пожелания успешно изменены.')
    }
  } catch {
    ctx.reply('Что-то пошло не так.')
    return ctx.scene.leave()
  }
  return ctx.scene.leave()
})

export const changePrefsScene = new Scenes.WizardScene('changePrefs', getPrefs, setPrefs)
