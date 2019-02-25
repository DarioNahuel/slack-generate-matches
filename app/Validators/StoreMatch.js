'use strict';

const ApiValidation = use('App/Validators/ApiValidation');

class StoreMatch extends ApiValidation {
  get rules () {
    return {
      user1_id: 'exists:users,id | required',
      user2_id: 'exists:users,id | required',
      time_id: 'exists:times,id | required',
    };
  }
}

module.exports = StoreMatch;
