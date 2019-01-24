'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Match extends Model {

  user () {
    return this.hasMany('App/Models/User')
  }

  time () {
    return this.hasOne('App/Models/Time')
  }

  static get hidden () {
    return ['created_at', 'updated_at'];
  }
}

module.exports = Match
