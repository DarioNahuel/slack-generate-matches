'use strict'

const Time = use('App/Models/Time');

/*
|--------------------------------------------------------------------------
| TimeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const hours = [
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
];

class TimeSeeder {
  async run () {
    await Promise.all(hours.map(async hour => Time.create({ hour })));
  }
}


module.exports = TimeSeeder
