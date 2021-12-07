const { TestHelper } = require("uu_appg01_server-test");
const CMD = "list/update";
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

describe("Testing the list/get...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false);
    let dtoIn = {
      id: "61a7d54dd1277f4aa0229fb1",
    };
    let help = await TestHelper.executePostCommand("list/create", { name: "List name", id: dtoIn.id }, session);
    let result = await TestHelper.executePostCommand("list/update", { name: "List name 2", id: help.id }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
