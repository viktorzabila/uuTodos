const { TestHelper } = require("uu_appg01_server-test");
const ValidateHelper = require("../validate-helper.js");
const PolygonsTestHelper = require("../polygons-test-helper.js");
const CMD = "list/get";
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
    code: "12345",
    name: "Alex",
    description: "desc",
  };
  await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
});

describe("Testing the list/get...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let dtoIn = {
      id: "61a757b471f3072b0ea41e63",
    };
    let help = await TestHelper.executePostCommand("list/create", { name: "List name" }, session);
    let result = await TestHelper.executeGetCommand(CMD, { id: help.id }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("Test - InvalidDtoIn", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    let expectedError = {
      code: `${CMD}/InvalidDtoIn`,
      message: "DtoIn is not valid.",
    };
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, { id: true }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);
    }
  });
  test("Test - todoInstanceDoesNotExist", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ awid: `vfr` })}}`;
    await TestHelper.executeDbScript(`db.todosMain.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `${CMD}/todoInstanceDoesNotExist`,
      message: "TodoInstance does not exist.",
    };
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, { id: "61a75db7a6c0412f13b7f718" }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toBeDefined();
    }
  });
  test("Test - listDoesNotExist", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{awid: "${TestHelper.awid}"}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `${CMD}/listDoesNotExist`,
      message: "List with given id does not exist.",
      paramMap: { id: "61a75db7a6c047912f13b7f718" },
    };
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, { id: "61a75db7a6c047912f13b7f718" }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);
    }
  });
  test("invalidDtoIn", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    expect.assertions(3);
    try {
      await TestHelper.executeGetCommand("list/get", { id: true }, session);
    } catch (e) {
      ValidateHelper.validateInvalidDtoIn(e, CMD);
    }
  });
});
