"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

}

module.exports = new ListController();
