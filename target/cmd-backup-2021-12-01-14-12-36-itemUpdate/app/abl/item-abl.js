"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },

  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.itemDao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }

  async get(uri, dtoIn, uuAppErrorMap={} ){
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid)

    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2 Checks state.

    if (!TodoInstance) {
      throw new Errors.Create.todoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }
    if (TodoInstance.state !== 'active') {
      throw new Errors.Create.todoInstanceIsNotInProperState({uuAppErrorMap}, {currentState: todoInstance.state}, {expectedState: "active", awid})
    }
    
    //HDS3 Creates uuObject list in uuAppObjectStore (using list DAO create).

    const uuObject = await this.itemDao.get(awid, dtoIn.id)
        if(!uuObject) {
          throw new Errors.Get.itemDoesNotExist({uuAppErrorMap})
        }

     // HDS4 Returns properly filled dtoOut.

     return {
       uuAppErrorMap,
       ...uuObject
     }
    }

  async create(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid)

    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 2 Checks state.

    if (!TodoInstance) {
      throw new Errors.Create.todoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }
    if (TodoInstance.state !== 'active') {
      throw new Errors.Create.todoInstanceIsNotInProperState({uuAppErrorMap}, {currentState: todoInstance.state}, {expectedState: "active", awid})
    }

    // HDS 3 Expands dtoIn with the key "state: active".
    let uuObject = {...dtoIn, awid};
    dtoIn.state = 'active';

    // HDS 4 - is the list entered in dtoIn.listId exists
    if(!dtoIn.listId) {
      throw new Errors.Create.listDoesNotExist({ uuAppErrorMap }, { awid })
    }
    
    //HDS5 System creates uuObject item in uuAppObjectStore (using item DAO create).

    let list = null;

    try {
      list = await this.itemDao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.itemDaoCreateFailed({ uuAppErrorMap }, err);
    }

     // HDS5 Returns properly filled dtoOut.

     return {
       uuAppErrorMap,
       ...list
     }
  }

}

module.exports = new ItemAbl();
