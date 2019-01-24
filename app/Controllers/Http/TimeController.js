'use strict'

const Time = use('App/Models/Time');

class TimeController {
  async index ({ response }) {
    response.json(await Time.all());
  }
}

module.exports = TimeController
