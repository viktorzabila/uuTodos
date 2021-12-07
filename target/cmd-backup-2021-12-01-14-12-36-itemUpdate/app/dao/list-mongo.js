"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject){
      return await super.insertOne(uuObject);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async getByAwid(awid) {
    let filter = {
      awid: awid,
    };
    return await super.findOne(filter);
  }
}

module.exports = ListMongo;
