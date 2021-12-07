"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

}

module.exports = new ListController();
