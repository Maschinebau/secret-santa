import { Composer, Scenes } from 'telegraf'
import { checkAuth, knex } from '../../db/knexfile.js'

const getPrefs = new Composer()
getPrefs.on('text', async (ctx) => {
  try {
    if (await checkAuth(ctx.message.from.username)) {
      ctx.reply(`Напишите ваши предпочтения:
Если передумали, напишите отмена.`)
      ctx.wizard.state.data = {}
      return ctx.wizard.next()
    } else {
      ctx.reply('Зарегистрируйтесь, чтобы указать предпочтения.')
      return ctx.scene.leave()
    }
  } catch {
    ctx.reply(
      'Что-то пошло не так. Проверте, указан ли у вас username в профиле, он необходим для регистрации.'
    )
    return ctx.scene.leave()
  }
})

const setPrefs = new Composer()
setPrefs.on('text', async (ctx) => {
  try {
    const regex = /^отмена$/i
    if (regex.test(ctx.message.text)) {
      ctx.reply('Смена предпочтений отменена.')
      return ctx.scene.leave()
    } else {
      ctx.wizard.state.data.preferences = ctx.message.text
      await knex('users')
        .where('telegramLogin', ctx.message.from.username)
        .update({ preferences: ctx.wizard.state.data.preferences })
      ctx.reply('Предпочтения успешно изменены.')
    }
  } catch {
    ctx.reply('Что-то пошло не так.')
    return ctx.scene.leave()
  }
  return ctx.scene.leave()
})

export const changePrefsScene = new Scenes.WizardScene('changePrefs', getPrefs, setPrefs)
