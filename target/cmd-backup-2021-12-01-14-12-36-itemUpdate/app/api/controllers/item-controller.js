"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class ItemController {

  get(ucEnv) {
    return ItemAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

}

module.exports = new ItemController();
