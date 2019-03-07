'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSlackIdSchema extends Schema {
  up () {
    this.table('users', table => {
      table.string('slack_id', 80).nullable().unique();
    });
  }

  down () {
    this.table('users', table => {
      table.drop('slack_id');
    });
  }
}

module.exports = UserSlackIdSchema;
