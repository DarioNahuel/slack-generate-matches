'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TimesSchema extends Schema {
  up () {
    this.create('times', table => {
      table.increments();
      table.string('hour', 5).notNullable().unique();
      table.timestamps();
    });
  }

  down () {
    this.drop('times');
  }
}

module.exports = TimesSchema
