"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {
  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  delete(ucEnv) {
    return ListAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return ListAbl.update(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new ListController();
