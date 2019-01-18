'use strict';

const ApiValidation = use('App/Validators/ApiValidation');

class StoreUser extends ApiValidation {
  get rules () {
    return { full_name: 'required' };
  }
}

module.exports = StoreUser;
