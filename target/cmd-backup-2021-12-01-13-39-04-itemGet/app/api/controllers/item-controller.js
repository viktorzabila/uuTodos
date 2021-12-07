"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class ItemController {

  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

}

module.exports = new ItemController();
