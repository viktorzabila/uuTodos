const { TestHelper } = require("uu_appg01_server-test");
const CMD = "list/list";
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

    let help = await TestHelper.executePostCommand("list/create", { name: "List name" }, session);
    let result = await TestHelper.executeGetCommand(CMD, {}, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
