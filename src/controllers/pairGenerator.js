import { db } from '../../db/db.js'

export const pairGenerator = async () => {
  const tableExists = await db.knex.schema.hasTable('users')
  if (tableExists) {
    const users = await db.knex('users').select('id', 'name')
    if (users.length < 2) {
      throw new Error('Недостаточно пользователей для формирования пар')
    }
    const shuffledUsers = shuffleArray(users)
    const pairs = {}
    for (let i = 0; i < shuffledUsers.length; i++) {
      const currentUser = shuffledUsers[i]
      let nextUser = shuffledUsers[(i + 1) % shuffledUsers.length]
      // Проверяем, что пользователь не является парой самому себе
      if (currentUser.id === nextUser.id) {
        nextUser = shuffledUsers[(i + 2) % shuffledUsers.length] // Находим следующего пользователя, исключая текущего
      }
      // Проверяем, что pair_name не повторяется у двух пользователей
      while (nextUser.name in pairs) {
        nextUser = shuffledUsers[(i + 2) % shuffledUsers.length] // Находим следующего пользователя, исключая текущего и уже существующих пар
      }
      currentUser.pair_name = nextUser.name
      pairs[nextUser.name] = true
      await db.knex.knex('users').where('id', currentUser.id).update('pair_name', nextUser.name)
    }
    console.log('Пары пользователей успешно сгенерированы!')
  } else {
    console.log('Таблица "users" не существует')
  }
}

// Функция для перемешивания массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
