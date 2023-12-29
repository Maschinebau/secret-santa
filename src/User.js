export class User {
  constructor(id, name, preferences, email, telegram_login, telegram_id, pair_name) {
    this.id = id
    this.name = name
    this.preferences = preferences
    this.email = email
    this.telegram_login = telegram_login
    this.telegram_id = telegram_id
    this.pair_name = pair_name
  }

  static deserialize({ id, name, preferences, email, telegram_login, telegram_id, pair_name }) {
    return new User(id, name, preferences, email, telegram_login, telegram_id, pair_name)
  }

  static deserializeFromDb(dbUser) {
    return new User(
      dbUser.id,
      dbUser.name,
      dbUser.preferences,
      dbUser.email,
      dbUser.telegram_login,
      dbUser.telegram_id,
      dbUser.pair_name
    )
  }
}


