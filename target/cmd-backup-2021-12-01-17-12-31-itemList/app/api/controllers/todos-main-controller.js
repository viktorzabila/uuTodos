"use strict";
const TodosMainAbl = require("../../abl/todos-main-abl.js");

class TodosMainController {
  init(ucEnv) {
    return TodosMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TodosMainController();
