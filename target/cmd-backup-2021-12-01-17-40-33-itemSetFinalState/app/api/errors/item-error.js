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
  itemDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist."
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

const Get = {
  UC_CODE: `${ITEM_ERROR_PREFIX}get/`,
  
  todoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
        this.message = "TodoInstance does not exist.";
    }
  },

  todoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Get.UC_CODE}todoInstanceIsNotInProperState`;
        this.message = "The application is not in proper state.";
    }
  },
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Get.UC_CODE}invalidDtoIn`;
        this.message = "DtoIn is not valid.";
    }
  },
  todoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist."
    }
  },
  itemGetDtoInType: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemGetDtoInType`;
      this.message = "Get  .";
    }
  },
  itemDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "List with given id does not exist."
    }
  },
};

const Update = {
  UC_CODE: `${ITEM_ERROR_PREFIX}update/`,
  
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Update.UC_CODE}invalidDtoIn`;
        this.message = "DtoIn is not valid.";
    }
  },

  todoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Update.UC_CODE}todoInstanceDoesNotExist`;
        this.message = "TodoInstance does not exist.";
    }
  },

  todoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${Update.UC_CODE}todoInstanceIsNotInProperState`;
        this.message = "The application is not in proper state.";
    }
  },
  itemDaoUpdateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDaoUpdateFailed`;
      this.message = "update Dao failed .";
    }
},

  itemDaoCreateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDaoCreateFailed`;
      this.message = "Update item by item DAO update failed.";
    }
  },
  listDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Update.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist."
    }
  },
  itemDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Update.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist."
    }
  },
  itemIsNotInCorrectState: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Update.UC_CODE}itemIsNotInCorrectState`;
      this.message = "Item is not in correct state."
    }
  },
};

const List = {
  UC_CODE: `${ITEM_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${List.UC_CODE}invalidDtoIn`;
        this.message = "DtoIn is not valid.";
    }
  },
  todoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${List.UC_CODE}todoInstanceDoesNotExist`;
        this.message = "TodoInstance does not exist.";
    }
  },
  todoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
        super(...arguments);
        this.code = `${List.UC_CODE}todoInstanceIsNotInProperState`;
        this.message = "The application is not in proper state.";
    }
  },
};

module.exports = {
  List,
  Update,
  Get,
  Create
};
