const { TestHelper } = require("uu_appg01_server-test");
const PolygonsTestHelper = require("../polygons-test-helper.js");
const ValidateHelper = require("../validate-helper.js");

const CMD = "list/create";

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
  let result = await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
  const filter = `{awid: "${TestHelper.awid}"}`;
  const params = `{$set: ${JSON.stringify({ state: `active` })}}`;
  await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params});`);
});

afterEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.teardown();
});

describe("Testing the list/create...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let result = await TestHelper.executePostCommand("list/create", { name: "List name" }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect.assertions(2);
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
  test("Test A3 - invalidDtoIn", async () => {
    let session = await TestHelper.login("Authorities", false, false);

    expect.assertions();
    try {
      await TestHelper.executePostCommand("list/create", { name: true }, session);
    } catch (e) {
      ValidateHelper.validateInvalidDtoIn(e, CMD);
    }
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
      await TestHelper.executePostCommand("list/create", PolygonsTestHelper.dtoIn.list.create, session);
    } catch (e) {
      ValidateHelper.validateError(e, expectedError);
    }
  });
  test("Test - deadlineDateIsFromThePast", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let expiredDate = "2002-12-13";
    let expectedError = {
      code: `${CMD}/deadlineDateIsFromThePast`,
      message: "Deadline date is from the past and therefore cannot be met.",
      paramMap: { deadline: expiredDate },
    };
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand(CMD, { name: "List name", deadline: expiredDate }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      console.log(error.status);
      expect(error.message).toEqual(expectedError.message);
      console.log(error.message);
      if (error.paramMap && expectedError.paramMap) {
        expect(error.paramMap).toEqual(expectedError.paramMap);
      }
    }
  });
});
