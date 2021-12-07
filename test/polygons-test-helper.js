const { TestHelper } = require("uu_appg01_server-test");
const { UriBuilder } = require("uu_appg01_server").Uri;
const AppClient = require("uu_appg01_server").AppClient;

let svc;
let baseUri;

class PolygonsTestHelper {
  static async initUuSubApp(startupServers) {
    if (startupServers) {
      await TestHelper.setup();
      await Server.start();
    }

    svc = IntService.getService();
    baseUri = svc.getGateway();

    const initAppWorkspaceDtoIn = {
      name: "uuShapesPolygonsg01 Local",
      locationUri: baseUri + "/userGate/folderDetail?id=5f2186a4ec87e44cb29dc795",
    };

    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace(initAppWorkspaceDtoIn);
  }

  static async initUuSubAppWithBtCallFail(dtoIn = {}, cmd, errCode, errMessage) {
    svc = IntService.getService();
    let createFail = IntService.ucPrepare[cmd]().throws(errCode, errMessage);
    let createFailSvc = Service.copy(svc, createFail);

    const initAppWorkspaceDtoIn = {
      name: "uuShapesPolygonsg01 Local",
      locationUri: createFailSvc.getGateway() + "/userGate/folderDetail?id=5f2186a4ec87e44cb29dc795",
    };

    await TestHelper.initUuSubAppInstance(dtoIn);
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace(initAppWorkspaceDtoIn);
  }

  static async initUuSubAppWithCustomDtoOut(dtoIn = {}, cmd, dtoOut) {
    svc = IntService.getService();
    let createFail = IntService.ucPrepare[cmd]().returns(dtoOut);
    let createFailSvc = Service.copy(svc, createFail);

    const initAppWorkspaceDtoIn = {
      name: "uuShapesPolygonsg01 Local",
      locationUri: createFailSvc.getGateway() + "/userGate/folderDetail?id=5f2186a4ec87e44cb29dc795",
    };

    await TestHelper.initUuSubAppInstance(dtoIn);
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace(initAppWorkspaceDtoIn);
  }

  static async changePolygonsAwid() {
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ awid: `test` })}}`;
    await TestHelper.executeDbScript(`db.polygons.findOneAndUpdate(${filter}, ${params});`);
  }

  static async polygonSetActiveState() {
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ state: `active` })}}`;
    await TestHelper.executeDbScript(`db.polygons.findOneAndUpdate(${filter}, ${params});`);
  }

  static async polygonSetFinalState() {
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ state: `final` })}}`;
    await TestHelper.executeDbScript(`db.polygons.findOneAndUpdate(${filter}, ${params});`);
  }

  static login(username, createPermission, globalLogin) {
    return TestHelper.login(username, createPermission, globalLogin);
  }

  static async clearDb() {
    let { collectionsClear } = DB_LIST;

    return await Promise.all(
      Object.values(collectionsClear).map((collection) => {
        return this.remove(collection, {});
      })
    );
  }

  static async post(useCase, dtoIn = {}, session = null, tid = null, awid = null) {
    const uri = new UriBuilder()
      .setGateway(TestHelper._gatewayUrl)
      .setProduct("uu-shapes-polygonsg01")
      .setAwid(awid || TestHelper.awid)
      .setUseCase(useCase)
      .toUri();

    const headers = {};
    if (session) {
      headers["Authorization"] = await session.getCallToken(uri);
    } else if (TestHelper._activeSession) {
      headers["Authorization"] = await TestHelper._activeSession.getCallToken(uri);
    }

    return await AppClient.post(uri, dtoIn, { headers: headers });
  }

  static async get(useCase, dtoIn = {}, session = null, tid = null, awid = null) {
    let uri = new UriBuilder()
      .setGateway(TestHelper._gatewayUrl)
      .setProduct("uu-shapes-polygonsg01")
      .setAwid(awid || TestHelper.awid)
      .setUseCase(useCase)
      .toUri();

    let headers = {};
    if (session) {
      headers["Authorization"] = await session.getCallToken(uri);
    } else if (TestHelper._activeSession) {
      headers["Authorization"] = await TestHelper._activeSession.getCallToken(uri);
    }

    return await AppClient.get(uri, dtoIn, { headers: headers });
  }
}

PolygonsTestHelper.UuBtUri = "http://localhost:8081/uu-businessterritory-maing01/00000000000000000000000000000003";

PolygonsTestHelper.HexagonLocation =
  "http://localhost:8081/uu-businessterritory-maing01/00000000000000000000000000000003/userGate/folderDetail?id=5f2186a4ec87e44cb29dc795";

PolygonsTestHelper.CmdList = {
  UuBt: {},
  Main: {
    Init: "sys/uuAppWorkspace/init",
    SetActive: "sys/uuSubAppInstance/setActiveSysState",
    SetRestricted: "sys/uuSubAppInstance/setRestrictedSysState",
    Get: "sys/uuAppWorkspace/get",
  },
};

PolygonsTestHelper.dtoIn = {
  list: {
    create: {
      name: "My hexagon",
      desc: "Description of hexagon",
      locationId: "5e6923a3180d87c54829a666",
    },
    update: {
      name: "My hexagon updated",
      desc: "Hexagon update cmd test",
    },
  },
  item: {
    create: {
      name: "My hexagon",
      desc: "Description of hexagon",
      locationId: "5e6923a3180d87c54829a666",
    },
    update: {
      name: "My hexagon updated",
      desc: "Hexagon update cmd test",
    },
  },
};

const DB_LIST = {
  collections: {
    shapesPolygons: "shapesPolygons",
    hexagon: "hexagon",
    sysKeyStore: "sysKeyStore",
    sysAppWorkspace: "sysAppWorkspace",
    uuBinary: "uuBinary",
  },
  collectionsClear: {
    shapesPolygons: "shapesPolygons",
    hexagon: "hexagon",
    sysKeyStore: "sysKeyStore",
    sysAppWorkspace: "sysAppWorkspace",
    uuBinary: "uuBinary",
  },
};

PolygonsTestHelper.States = {
  CANCELLED: "cancelled",
  FINAL: "final",
  ALTERNATIVE_FINAL: "alternativeFinal",

  ACTIVE: "active",
  ALTERNATIVE_ACTIVE: "alternativeActive",
  PROBLEM: "problem",
  PASSIVE: "passive",
  CLOSED: "closed",
  INITIAL: "initial",
};

PolygonsTestHelper.States.FINAL_LIST = [
  PolygonsTestHelper.States.CANCELLED,
  PolygonsTestHelper.States.FINAL,
  PolygonsTestHelper.States.ALTERNATIVE_FINAL,
];
PolygonsTestHelper.States.ACTIVE_LIST = [
  PolygonsTestHelper.States.ACTIVE,
  PolygonsTestHelper.States.ALTERNATIVE_ACTIVE,
  PolygonsTestHelper.States.PROBLEM,
  PolygonsTestHelper.States.PASSIVE,
];

module.exports = PolygonsTestHelper;
