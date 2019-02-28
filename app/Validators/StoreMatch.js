'use strict';

const ApiValidation = use('App/Validators/ApiValidation');

class StoreMatch extends ApiValidation {
  get rules () {
    return {
      user1Id: 'exists:users,id | required',
      user2Id: 'exists:users,id | required',
      timeId: 'exists:times,id | required',
    };
  }
}

module.exports = StoreMatch;
