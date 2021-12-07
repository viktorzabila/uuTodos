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

  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },

  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },

  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },

  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }

  async list(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    if (!dtoIn.pageInfo) {
      dtoIn.pageInfo = {};
    }
    if (!dtoIn.pageInfo.pageIndex) {
      dtoIn.pageInfo.pageIndex = 0;
    }
    if (!dtoIn.pageInfo.pageSize) {
      dtoIn.pageInfo.pageSize = 1000;
    }

    // HDS 2 System checks existence and state of the todoInstance uuObject.

    const uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    // HDS 3 System loads from uuAppObjectStore basic attributes of all uuObject items by keys given in dtoIn, and saves them to dtoOut.itemList.

    let uuObject = { ...dtoIn, awid };

    let item = await this.listDao.list(uuObject);

    // HDS 4 Returns properly filled dtoOut.

    return {
      ...item,
      uuAppErrorMap,
    };
  }

  async delete(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    if (!dtoIn.forceDelete) {
      dtoIn.forceDelete = false;
    }

    // HDS 2 System checks existence and state of the todoInstance uuObject.

    const uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    // HDS 3 System gets the uuObject list from the uuAppObjectStore and checks its existence (using list DAO get with awid and dtoIn.id).

    let uuObject = await this.listDao.get(awid, dtoIn.id);
    if (!uuObject) {
      throw new Errors.Delete.ListDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // HDS 4 System loads all active items related to the list (using item DAO listByListAndState, where listId = dtoIn.id and state = active) and verifies that count of active items in the list is 0.
    let filterMap = { awid, listId: dtoIn.id, state: "active" };
    let uuItems = await this.itemDao.listByListIdAndState(filterMap);
    console.log(uuItems);
    let itemLength = uuItems.itemList.length;

    // HDS 5 System deletes all item uuObjects in the list from uuAppObjectStore (using item DAO deleteManyByListId with awid and dtoIn.id).

    if (dtoIn.forceDelete === false && itemLength) {
      throw new Errors.Delete.ListContainsActiveItems({ uuAppErrorMap }, { id: dtoIn.id, itemList: uuItems.itemList });
    } else {
      await this.itemDao.deleteManyByList(awid, dtoIn.id);
    }

    // HDS 6 System deletes list from the uuAppObjectStore (using list DAO delete with awid and dtoIn.id).

    let uuDeleteList = { ...dtoIn, awid };
    await this.listDao.delete(uuDeleteList);

    // HDS 7 Returns properly filled dtoOut.
    return {
      uuAppErrorMap,
    };
  }

  async get(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid);

    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2 Checks state.

    if (!TodoInstance) {
      throw new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }
    if (TodoInstance.state !== "active") {
      throw new Errors.Create.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { currentState: todoInstance.state },
        { expectedState: "active", awid }
      );
    }

    //HDS3 Creates uuObject list in uuAppObjectStore (using list DAO create).

    const uuObject = await this.listDao.get(awid, dtoIn.id);
    if (!uuObject) {
      throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap });
    }

    // HDS4 Returns properly filled dtoOut.

    return {
      uuAppErrorMap,
      ...uuObject,
    };
  }

  async create(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid);

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
      throw new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }
    if (TodoInstance.state !== "active") {
      throw new Errors.Create.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { currentState: TodoInstance.state },
        { expectedState: "active", awid }
      );
    }

    // HDS 3 verifies that date is not from past
    let uuObject = { ...dtoIn, awid };

    if (uuObject.deadline) {
      const inputDate = new Date(uuObject.deadline);
      const currentDate = new Date();
      if (inputDate.getTime() < currentDate.getTime()) {
        throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: uuObject.deadline });
      }
    }

    //HDS4 Creates uuObject list in uuAppObjectStore (using list DAO create).

    let list = null;

    try {
      list = await this.listDao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS5 Returns properly filled dtoOut.

    return {
      ...list,
      uuAppErrorMap,
    };
  }

  async update(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2 - find(check existance) "=> Update"
    let uuObject = null;
    uuObject = await this.listDao.get(awid, dtoIn.id);

    if (!uuObject) {
      throw Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, { tema: dtoIn.id });
    }

    // HDS 3 verifies that date is not from past

    if (uuObject.deadline) {
      const inputDate = new Date(uuObject.deadline);
      const currentDate = new Date();
      if (inputDate.getTime() < currentDate.getTime()) {
        throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: uuObject.deadline });
      }
    }

    // HDS 4 - update
    uuObject = { ...dtoIn, awid };
    try {
      uuObject = await this.listDao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.ListDaoUpdateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5 - return
    return {
      ...uuObject,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
