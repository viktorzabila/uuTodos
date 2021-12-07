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
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }

  async setFinalState(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const ToDoInstance = await this.mainDao.getByAwid(awid)
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setFinalStateUnsupportedKeys.code,
      Errors.SetFinalState.InvalidDtoIn
    );

    // if (ToDoInstance.state !== "active") {
    //   ToDoInstance.state = "cancelled" 
    // } else {
    //   ToDoInstance.state == "completed"
    // }
    
    // HDS 2 - check existence and state of the todoInstance uuObject
    if (!ToDoInstance) {
      throw new Errors.SetFinalState.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
    }

    if (ToDoInstance.state !== 'active') {
      throw new Errors.SetFinalState.todoInstanceIsNotInProperState({ uuAppErrorMap }, { expectedState: "active", awid })
    }

    // HDS 3 - System verifies, that the list entered in dtoIn.id exists

    let item = await this.itemDao.get(awid, dtoIn.id);

    if (!item) {
      throw new Errors.SetFinalState.itemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    if (item.state !== "active") {
      throw new Errors.SetFinalState.itemIsNotInProperState({ uuAppErrorMap }, { id: dtoIn.id, currentState: item.state, expectedState: "active" });
    }

    // HDS 4 - System saves dtoIn to uuAppObjectStore (using item DAO setFinalState with awid and dtoIn). The result is saved to item.
    let uuObjectItem = null;
    try {
      uuObjectItem = await this.itemDao.setFinalState({ awid, id: dtoIn.id }, itemObject);
    } catch (e) {
      throw new Errors.SetFinalState.itemIsNotInProperState({ uuAppErrorMap }, 	{ id: dtoIn.id, state: item.state, expectedState: "active" }, e);
    }

    // HDS 5 - returns properly filled dtoOut
    return {
      uuAppErrorMap,
      ...uuObjectItem
    }
  }

  async list(uri, dtoIn, session, uuAppErrorMap = {}) { 
   
   
    const awid = uri.getAwid() 
   
   
    // HDS 1 Validation of dtoIn. 
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn); 
      uuAppErrorMap = ValidationHelper.processValidationResult( 
        dtoIn, 
        validationResult, 
        WARNINGS.listUnsupportedKeys.code, 
        Errors.List.InvalidDtoIn 
      ); 
      if(!dtoIn.pageInfo){ 
        dtoIn.pageInfo = {} 
      } 
      if(!dtoIn.pageInfo.pageIndex){ 
        dtoIn.pageInfo.pageIndex = 0 
      } 
      if(!dtoIn.pageInfo.pageSize){ 
        dtoIn.pageInfo.pageSize = 1000 
      } 
     
     
    // HDS 2 System checks existence and state of the todoInstance uuObject. 
   
    const uuTodosMain = await this.mainDao.getByAwid(awid) 
   
    if (!uuTodosMain) { 
      throw new Errors.Delete.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid}) 
    } 
   
    if (uuTodosMain.state !== 'active') { 
      throw new Errors.Delete.TodoInstanceIsNotInProperState({uuAppErrorMap}, {expectedState: "active", awid, currentState: uuTodosMain.state }) 
    } 
   
    // HDS 3 System loads from uuAppObjectStore basic attributes of all uuObject items by keys given in dtoIn, and saves them to dtoOut.itemList. 
   
    let uuObject = {...dtoIn, awid} 
    if(uuObject.listId && uuObject.state){ 
       
        uuObject = await this.itemDao.listByListIdAndState(uuObject) 
       
    }else if(uuObject.state){ 
       
        uuObject = await this.itemDao.listByState(uuObject) 
       
    } else { 
        
        uuObject = await this.itemDao.list(uuObject) 
       
    } 
   
   
    // HDS 4 Returns properly filled dtoOut. 
   
    return { 
      ...uuObject 
    } 
   
   
    }

  async update(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const ToDoInstance = await this.mainDao.getByAwid(awid)
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
      throw new Errors.Update.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
    }

    if (ToDoInstance.state !== 'active') {
      throw new Errors.Update.todoInstanceIsNotInProperState({ uuAppErrorMap }, { expectedState: "active", awid })
    }


    // HDS 3 - item has to be active in order to be updated
    let itemObject = {...dtoIn, awid};


    // HDS 4 - System verifies, that the list entered in dtoIn.listId exists

    let item = await this.itemDao.get(awid, dtoIn.id);

    if (!item) {
      throw new Errors.Update.itemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    if(item.state !== "active") {
      throw new Errors.Update.itemIsNotInCorrectState({ uuAppErrorMap }, { id: dtoIn.id, currentState: item.state, expectedState: "active" });
    }

    // HDS 5 - system updates uuObject item in the uuAppObjectStore
    let uuObjectItem = null;
    try {
      uuObjectItem = await this.itemDao.update({ awid, id: dtoIn.id }, itemObject);
    } catch (e) {
      throw new Errors.Update.itemDaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 6 - returns properly filled dtoOut
    return {
      uuAppErrorMap,
      ...uuObjectItem
    }
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
    let uuObject = {...dtoIn, awid, state: "active"};

    // HDS 4 - is the list entered in dtoIn.listId exists
    if(!dtoIn.listId) {
      throw new Errors.Create.listDoesNotExist({ uuAppErrorMap }, { id: uuObject.listId })
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
