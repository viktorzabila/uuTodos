const { TestHelper } = require("uu_appg01_server-test");
const CMD = "item/create";
const ValidateHelper = require("../validate-helper.js");
const PolygonsTestHelper = require("../polygons-test-helper");

afterEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  let session = await TestHelper.login("AwidLicenseOwner", false, false);

  let dtoIn = {
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
    code: "123",
    name: "aaa",
    description: "...",
  };
  let result = await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
});

describe("Testing the item/create...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false);
    let list = await TestHelper.executePostCommand(
      "list/create",
      { name: "first list", description: "description of the first list", deadline: "2021-12-15" },
      session
    );
    let result = await TestHelper.executePostCommand(
      "item/create",
      { listId: list.id, text: "text of the item 4" },
      session
    );
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });
  test("TodoInstanceDoesNotExist", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    let filter = `{awid: "${TestHelper.awid}"}`;
    let restore = `{$set: ${JSON.stringify({ awid: `active` })}}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${restore});`);
    let params = `{$set: ${JSON.stringify({ awid: 77777777777777 })}}`;
    let db = await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: "todoInstanceDoesNotExist",
      message: "TodoInstance does not exist.",
    };
    try {
      let com = await TestHelper.executePostCommand("list/create", { name: "Hello list" }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);
    }
    expect.assertions(2);
  });
  test("Test - todoInstanceIsNotInProperState", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    let filter = `{awid: "${TestHelper.awid}"}`;
    let restore = `{$set: ${JSON.stringify({ state: `underConstruction` })}}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${restore});`);

    let expectedError = {
      code: `${CMD}/todoInstanceIsNotInProperState`,
      message: "The application is not in proper state.",
    };
    let errMsg = "The application is not in proper state.";

    try {
      await TestHelper.executePostCommand("item/create", PolygonsTestHelper.dtoIn.item.create, session);
    } catch (e) {}
  });
  test("Test A3 - invalidDtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false);
    expect.assertions();
    try {
      await TestHelper.executePostCommand("item/create", { name: true }, session);
    } catch (e) {
      ValidateHelper.validateInvalidDtoIn(e, CMD);
    }
  });
});
