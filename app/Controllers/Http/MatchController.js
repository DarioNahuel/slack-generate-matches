'use strict';

const Match = use('App/Models/Match');

const matchTaken = async timeId => {
  const matches = await Match.query()
    .createdToday()
    .where('time_id', timeId).fetch();
  return !!matches.size();
};

class MatchController {
  async index ({ response }) {
    response.json(await Match.query().createdToday().fetch());
  }

  async store ({ request, response }) {
    const { user1_id, user2_id, time_id } = request.all();

    if (user1_id === user2_id || await matchTaken(time_id)) {
      return response.status(400).json('bad request');
    }

    const match = await Match.create({ user1_id, user2_id, time_id });

    response.status(201).json(match);
  }

  async destroy ({ request, response }) {
    const { id } = request.params;
    const match = await Match.findOrFail(id);
    await match.delete();
    response.status(204).json('match deleted');
  }
}

module.exports = MatchController;
