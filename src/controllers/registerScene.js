import { Composer, Scenes, Markup } from 'telegraf'
import { userServiceInst } from '../services/UserServices.js'

function buildRegistrationScene(userService) {
  const setName = new Composer()

  setName.on('text', async (ctx) => {
    try {
      if (await userService.checkAuth(ctx.message.from.id)) {
        await ctx.reply('Вы уже зарегистрированы!')
        return ctx.scene.leave()
      } else {
        await ctx.replyWithHTML(
          'Как вас зовут?',
          Markup.inlineKeyboard([[Markup.button.callback('Отмена', 'btn_1')]])
        )
        ctx.wizard.state.data = {}
        return ctx.wizard.next()
      }
    } catch (e) {
      console.log(e)
    }
  })

  const setPrefs = new Composer()

  setPrefs.on('text', async (ctx) => {
    try {
      const regex = /^отмена$/i
      const regexNames = /^(Никита|Ксюша|Ксения|Саня|Саша|Андрей|Женя|Евгений|дрюс)$/i
      if (regex.test(ctx.message.text)) {
        ctx.reply('Регистрация отменена.')
        return ctx.scene.leave()
      } else {
        await ctx.replyWithHTML(
          `Напишите ваши пожелания в одном сообщении.
Если их нет - поставьте прочерк.`,
          Markup.inlineKeyboard([[Markup.button.callback('Отмена', 'btn_1')]])
        )
        ctx.wizard.state.data.name = ctx.message.text
        return ctx.wizard.next()
      }
    } catch (error) {
      ctx.reply(`Регистрация не завершена, что-то пошло не так.`)
      return ctx.scene.leave()
    }
  })

  const registerEnd = new Composer()

  registerEnd.on('text', async (ctx) => {
    try {
      const regex = /^отмена$/i
      if (regex.test(ctx.message.text)) {
        ctx.reply('Регистрация отменена.')
        return ctx.scene.leave()
      } else {
        ctx.wizard.state.data.preferences = ctx.message.text
        ctx.wizard.state.data.telegram_login = ctx.message.from.username
        ctx.wizard.state.data.telegram_id = ctx.message.from.id
        await userService.saveUserOnRegistration(ctx.wizard.state.data)
        await ctx.reply('Вы успешно зарегистрированы!')
      }
    } catch {
      ctx.reply(`Регистрация не завершена, что-то пошло не так.`)
    }
    return ctx.scene.leave()
  })

  return new Scenes.WizardScene('registration', setName, setPrefs, registerEnd)
}

export const registrationScene = buildRegistrationScene(userServiceInst)
