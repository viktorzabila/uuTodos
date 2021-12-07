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
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("todoInstance");
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
    if  (uuObject.listId && uuObject.state) { 
       
        uuObject = await this.listDao.listByListIdAndState(uuObject) 
       
    } else if(uuObject.state){ 
       
        uuObject = await this.listDao.listByState(uuObject) 
       
    } else { 
        
        uuObject = await this.listDao.list(uuObject) 
       
    } 
   
   
    // HDS 4 Returns properly filled dtoOut. 
   
    return { 
      ...uuObject 
    } 
   
   
    }

  async delete(awid, dtoIn) {
    
  }

  async get(uri, dtoIn, uuAppErrorMap={} ){
    const awid = uri.getAwid();
    const TodoInstance = await this.mainDao.getByAwid(awid)

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
      throw new Errors.Create.todoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }
    if (TodoInstance.state !== 'active') {
      throw new Errors.Create.todoInstanceIsNotInProperState({uuAppErrorMap}, {currentState: todoInstance.state}, {expectedState: "active", awid})
    }
    
    //HDS3 Creates uuObject list in uuAppObjectStore (using list DAO create).

    const uuObject = await this.listDao.get(awid, dtoIn.id)
        if(!uuObject) {
          throw new Errors.Get.listDoesNotExist({uuAppErrorMap})
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

  async update(uri, dtoIn, uuAppErrorMap = {}){
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
    let uuObject = null
    uuObject = await this.listDao.get(awid, dtoIn.id)

    if(!uuObject){
      throw Errors.Update.todoInstanceDoesNotExist({ uuAppErrorMap }, { tema: dtoIn.id })
    }

    // HDS 3 verifies that date is not from past

    if(uuObject.deadline){
      const inputDate = new Date(uuObject.deadline);
      const currentDate = new Date();
      if(inputDate.getTime() < currentDate.getTime()) {
        throw new Errors.Create.deadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: uuObject.deadline });
      }
    }

    // HDS 4 - update
    uuObject = {...dtoIn, awid}
    try {
      uuObject = await this.listDao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.listDaoUpdateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5 - return
    return {
      ...uuObject,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
