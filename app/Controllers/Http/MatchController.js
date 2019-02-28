'use strict';

const Match = use('App/Models/Match');
const CustomException = use('App/Exceptions/CustomException');

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
    const { user1Id, user2Id, timeId } = request.all();

    if (await matchTaken(timeId)) {
      throw new CustomException('match taken', 400, 'bad request');
    }

    if (user1Id === user2Id) {
      throw new CustomException('player1 cant be equal to player2', 400, 'bad request');
    }

    const match = await Match.create({
      user1_id: user1Id,
      user2_id: user2Id,
      time_id: timeId,
    });

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
