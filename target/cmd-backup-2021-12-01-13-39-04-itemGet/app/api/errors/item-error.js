"use strict";

const TodosMainUseCaseError = require("./todos-main-use-case-error.js");
const ITEM_ERROR_PREFIX = `${TodosMainUseCaseError.ERROR_PREFIX}item/`;

const Create = {
  UC_CODE: `${ITEM_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Create.UC_CODE}invalidDtoIn`;
        this.message = "DtoIn is not valid.";
    }
  },

  todoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
        this.message = "TodoInstance does not exist.";
    }
  },

  todoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
        this.message = "The application is not in proper state.";
    }
  },
  itemCreateDtoInType: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemCreateDtoInType`;
      this.message = "Joke food .";
    }
  },
  listDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist."
    }
  },

  itemDaoCreateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = "Creating list by list DAO create failed.";
    }
  }
};

module.exports = {
  Create
};
