const { TestHelper } = require("uu_appg01_server-test");
const CMD = "list/delete";
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

describe("Testing the list/delete...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let dtoIn = {
      id: "61a7d54dd1277f4aa0229fb1",
    };
    let help = await TestHelper.executePostCommand("list/create", { name: "List name", id: dtoIn.id }, session);
    let result = await TestHelper.executePostCommand("list/delete", { name: "List name 2", id: help.id }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
