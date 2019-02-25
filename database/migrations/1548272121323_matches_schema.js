'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MatchesSchema extends Schema {
  up () {
    this.create('matches', table => {
      table.increments();
      table.integer('user1_id').unsigned();
      table.integer('user2_id').unsigned();
      table.integer('time_id').unsigned();
      table.foreign('user1_id').references('users.id').onDelete('cascade');
      table.foreign('user2_id').references('users.id').onDelete('cascade');
      table.foreign('time_id').references('times.id').onDelete('cascade');
      table.timestamps();
    });
  }

  down () {
    this.drop('matches');
  }
}

module.exports = MatchesSchema;
