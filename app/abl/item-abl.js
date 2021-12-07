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

  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },

  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },

  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`,
  },

  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
};

class ItemAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }

  async delete(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const ToDoInstance = await this.mainDao.getByAwid(awid);
    // HDS validation 1
    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    // HDS 2 System checks existence and state of the todoInstance uuObject.

    if (!ToDoInstance) {
      throw new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (ToDoInstance.state !== "active") {
      throw new Errors.Update.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: todoInstance.state }
      );
    }

    // HDS 3

    let item = await this.itemDao.get(awid, dtoIn.id);

    // HDS 4

    if (!item) {
      throw new Errors.Delete.ItemDoesNotExist({ uuAppErrorMap }, { awid, id: dtoIn.id });
    } else {
      await this.itemDao.delete(item);
    }
    // HDS 5

    return {
      ...item,
      uuAppErrorMap,
    };
  }

  async setFinalState(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const ToDoInstance = await this.mainDao.getByAwid(awid);
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setFinalStateUnsupportedKeys.code,
      Errors.SetFinalState.InvalidDtoIn
    );

    // HDS 2 - check existence and state of the todoInstance uuObject
    if (!ToDoInstance) {
      throw new Errors.SetFinalState.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (ToDoInstance.state !== "active") {
      throw new Errors.SetFinalState.TodoInstanceIsNotInProperState({ uuAppErrorMap }, { awid });
    }

    // HDS 3 - System verifies, that the item entered in dtoIn.id exists

    let item = await this.itemDao.get(awid, dtoIn.id);

    if (!item) {
      throw new Errors.SetFinalState.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    if (item.state !== "active") {
      throw new Errors.SetFinalState.ItemIsNotInProperState(
        { uuAppErrorMap },
        { id: dtoIn.id, currentState: item.state }
      );
    }

    // HDS 4 - System saves dtoIn to uuAppObjectStore (using item DAO setFinalState with awid and dtoIn). The result is saved to item.
    let uuObject = { ...dtoIn, awid };
    let itemObject = await this.itemDao.setFinalState({ awid, id: dtoIn.id }, uuObject);

    // HDS 5 - returns properly filled dtoOut
    return {
      uuAppErrorMap,
      ...itemObject,
    };
  }

  async list(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
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
    if (uuObject.listId && uuObject.state) {
      uuObject = await this.itemDao.listByListIdAndState(uuObject);
    } else if (uuObject.state) {
      uuObject = await this.itemDao.listByState(uuObject);
    } else {
      uuObject = await this.itemDao.list(uuObject);
    }

    // HDS 4 Returns properly filled dtoOut.

    return {
      ...uuObject,
    };
  }

  async update(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const ToDoInstance = await this.mainDao.getByAwid(awid);
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2 - check existence and state of the todoInstance uuObject
    if (!ToDoInstance) {
      throw new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (ToDoInstance.state !== "active") {
      throw new Errors.Update.TodoInstanceIsNotInProperState({ uuAppErrorMap }, { expectedState: "active", awid });
    }

    // HDS 3 - item has to be active in order to be updated
    let itemObject = { ...dtoIn, awid };

    // HDS 4 - System verifies, that the list entered in dtoIn.listId exists

    let item = await this.itemDao.get(awid, dtoIn.id);

    if (!item) {
      throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    if (item.state !== "active") {
      throw new Errors.Update.ItemIsNotInCorrectState(
        { uuAppErrorMap },
        { id: dtoIn.id, currentState: item.state, expectedState: "active" }
      );
    }

    // HDS 5 - system updates uuObject item in the uuAppObjectStore
    let uuObjectItem = null;
    try {
      uuObjectItem = await this.itemDao.update({ awid, id: dtoIn.id }, itemObject);
    } catch (e) {
      throw new Errors.Update.ItemDaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 6 - returns properly filled dtoOut
    return {
      uuAppErrorMap,
      ...uuObjectItem,
    };
  }

  async get(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid);

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

    const uuObject = await this.itemDao.get(awid, dtoIn.id);
    if (!uuObject) {
      throw new Errors.Get.ItemDoesNotExist({ uuAppErrorMap });
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

    const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
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
        { currentState: todoInstance.state },
        { expectedState: "active", awid }
      );
    }

    // HDS 3 Expands dtoIn with the key "state: active".
    let uuObject = { ...dtoIn, awid, state: "active" };

    // HDS 4 - is the list entered in dtoIn.listId exists
    if (!dtoIn.listId) {
      throw new Errors.Create.ListDoesNotExist({ uuAppErrorMap }, { id: uuObject.listId });
    }

    //HDS5 System creates uuObject item in uuAppObjectStore (using item DAO create).

    let list = null;

    try {
      list = await this.itemDao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.ItemDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS5 Returns properly filled dtoOut.

    return {
      uuAppErrorMap,
      ...list,
    };
  }
}

module.exports = new ItemAbl();
