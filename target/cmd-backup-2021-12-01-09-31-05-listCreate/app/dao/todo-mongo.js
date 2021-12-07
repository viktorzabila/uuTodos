const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TodosMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({awid: 1, listId: 1, state: 1})
    await super.createIndex({awid: 1, state: 1})
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne(filter);
  }

//   async update(uuObject) {
//     let filter = {
//       awid: uuObject.awid,
//       id: uuObject.id,
//     };
//     return await super.findOneAndUpdate(filter, uuObject, "NONE");
//   }

//   async remove(uuObject) {
//     let filter = {
//       awid: uuObject.awid,
//       id: uuObject.id,
//     };
//     return await super.deleteOne(filter);
//   }
}

module.exports = TodosMainMongo;