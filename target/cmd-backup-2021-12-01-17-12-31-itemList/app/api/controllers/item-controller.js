"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class ItemController {

  update(ucEnv) {
    return ItemAbl.update(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return ItemAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

}

module.exports = new ItemController();
