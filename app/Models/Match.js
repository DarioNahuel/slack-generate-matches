'use strict';

const moment = use('moment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Match extends Model {
  user1 () {
    return this.belongsTo('App/Models/User', 'user1_id', 'id');
  }

  user2 () {
    return this.belongsTo('App/Models/User', 'user2_id', 'id');
  }

  time () {
    return this.belongsTo('App/Models/Time');
  }

  static get hidden () {
    return ['created_at', 'updated_at'];
  }

  static scopeCreatedToday (query) {
    const startOfToday = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    return query.where('created_at', '>', startOfToday);
  }

  static scopeWithRelated (query) {
    return query.with('time').with('user1').with('user2');
  }

  static async taken (timeId) {
    const matches = await this.query()
      .createdToday()
      .where('time_id', timeId).fetch();
    return !!matches.size();
  }
}

module.exports = Match;
