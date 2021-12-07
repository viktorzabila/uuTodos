"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/todos-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

const logger = LoggerFactory.get("TodosMainAbl");

class TodosMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("todoInstance");
  }

  async init(uri, dtoIn, session, uuAppErrorMap) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["todoInstance"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // HDS 3
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    try {
      await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
    } catch (e) {
      if (e instanceof UuAppWorkspaceError) {
        // A4
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
      }
      throw e;
    }

    // HDS 4 - HDS N
    // TODO Implement according to application needs...
    const uuObject = {
      ...restDtoIn,
      state: "active",
      awid,
    };

    let uuTodoInstance = null;
    try {
      uuTodoInstance = await this.dao.create(uuObject);
    } catch (e) {
      throw new Errors.Init.TodoInstanceCreateDaoFailed({ uuAppErrorMap }, e);
    }
    // HDS N+1

    return {
      ...uuTodoInstance,
      uuAppErrorMap,
    };
  }
}

module.exports = new TodosMainAbl();
