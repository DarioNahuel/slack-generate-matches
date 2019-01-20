'use strict';

const path = use('path');
const swaggerCombine = use('swagger-combine');

class DocumentationController {
  async index ({ response }) {
    try {
      const documentation = await swaggerCombine(path.join(__dirname, '/../../../documentation/index.yaml'));

      response.json(documentation);
    } catch (error) {
      response.json(error);
    }
  }
}

module.exports = DocumentationController;
