"use strict";

const TodosMainUseCaseError = require("./todos-main-use-case-error.js");
const LIST_ERROR_PREFIX = `${TodosMainUseCaseError.ERROR_PREFIX}list/`;

const Create = {
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,

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

  deadlineDateIsFromThePast: class extends TodosMainUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${Create.UC_CODE}deadlineDateIsFromThePast`;
    this.message = "Deadline date is from the past and therefore cannot be met.";
  }
  },
  listCreateDtoInType: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createJokeFailed`;
      this.message = "Joke food .";
    }
},

  listDaoCreateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Creating list by list DAO create failed.";
    }
  }
};

const Get = {
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,
  
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
  listDoesNotExist: class extends TodosMainUseCaseError {
    constructor(){
      super(...arguments)
      this.code = `${Get.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist."
    }
  },
  listGetDtoInType: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}listGetDtoInType`;
      this.message = "Get  .";
    }
},
};

const Update = {
  UC_CODE: `${LIST_ERROR_PREFIX}update/`,
  
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

  deadlineDateIsFromThePast: class extends TodosMainUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${Create.UC_CODE}deadlineDateIsFromThePast`;
    this.message = "Deadline date is from the past and therefore cannot be met.";
  }
  },
  listDaoUpdateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoUpdateFailed`;
      this.message = "Joke food .";
    }
},

  listDaoCreateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Creating list by list DAO create failed.";
    }
  }
};

const Delete = {
  UC_CODE: `${LIST_ERROR_PREFIX}delete/`,
  
};

const List = {
  UC_CODE: `${LIST_ERROR_PREFIX}list/`,
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
  Delete,
  Update,
  Get,
  Create
};
