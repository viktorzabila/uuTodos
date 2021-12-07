"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

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
