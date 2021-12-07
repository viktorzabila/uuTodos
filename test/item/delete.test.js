const { TestHelper } = require("uu_appg01_server-test");
const ValidateHelper = require("../validate-helper.js");
const PolygonsTestHelper = require("../polygons-test-helper");
const CMD = "item/delete";
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
    code: "48348330548954",
    name: "uuTodosMaing01",
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
  };
  await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
});

describe("Testing the item/delete...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("Authorities", false);

    let help = await TestHelper.executePostCommand(
      "item/create",
      {
        text: "Item name",
        listId: "61a7dcd1a8777f4cb3d2b3bb",
      },
      session
    );
    let result = await TestHelper.executePostCommand("item/delete", { text: "Item name 2", id: help.id }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
