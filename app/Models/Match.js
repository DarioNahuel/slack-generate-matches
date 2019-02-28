'use strict';

const moment = use('moment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Match extends Model {
  user () {
    return this.hasMany('App/Models/User');
  }

  time () {
    return this.hasOne('App/Models/Time');
  }

  static get hidden () {
    return ['created_at', 'updated_at'];
  }

  static scopeCreatedToday (query) {
    const startOfToday = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    return query.where('created_at', '>', startOfToday);
  }
}

module.exports = Match;
