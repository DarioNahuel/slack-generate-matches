'use strict';

const { formatters } = use('Validator');

class ApiValidation {
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages);
  }

  get formatter () {
    return formatters.JsonApi;
  }
}

module.exports = ApiValidation;
