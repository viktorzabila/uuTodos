"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }

  async create(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid)

    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
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

    // HDS 3 verifies that date is not from past
    let uuObject = {...dtoIn, awid};

    if(uuObject.deadline){
      const inputDate = new Date(uuObject.deadline);
      const currentDate = new Date();
      if(inputDate.getTime() < currentDate.getTime()) {
        throw new Errors.Create.deadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: uuObject.deadline });
      }
    }
    
    // HDS 2 - to test 
    //   let listObject;
    // if (dtoIn.image) {
    //   try {
    //     jokeImage = await this.jokeImageDao.create({awid}, dtoIn.image);
    //   } catch (e) {
    //     if (e instanceof BinaryStoreError) { // A3
    //       throw new Errors.Create.JokeImageDaoCreateFailed({uuAppErrorMap}, e);
    //     }
    //     throw e;
    //   }
    //   dtoIn.image = jokeImage.code;
    // }

    //HDS4 Creates uuObject list in uuAppObjectStore (using list DAO create).

    let list = null;

    try {
      list = await this.listDao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, err);
    }

     // HDS5 Returns properly filled dtoOut.

     return {
       uuAppErrorMap,
       ...list
     }
  }

}

module.exports = new ListAbl();
