"use strict";
const { Helper } = require("../test/polygons-test-helper");

const APP_CODE = "uu-todos-main";

const ValidateHelper = {
    assertionsCount: {
        invalidDtoIn: 3,
        error: 3,
        errorWithParamMap: 4,
    },

    appCodePrefix(param) {
        return `${APP_CODE}/${param}`;
    },

    validateBaseHds(response) {
        expect(response.status).toEqual(200);
        expect(response.uuAppErrorMap).toBeDefined();
        expect(response.uuAppErrorMap).toEqual({});
    },

    validateBaseListResult(response, expectedCount, pageIndex = 0, pageSize = 1000) {
        expect(response.itemList).toBeDefined();
        expect(response.itemList.length).toBe(expectedCount);
        expect(response.pageInfo).toBeDefined();
        expect(response.pageInfo.pageIndex).toBe(pageIndex);
        expect(response.pageInfo.pageSize).toBe(pageSize);
    },

    validateBaseObjectData(response) {
        expect(response.awid).toBeDefined();
        expect(response.sys).toBeDefined();
        expect(response.id).toBeDefined();
        expect(response.sys).toEqual({
            cts: expect.anything(Date),
            mts: expect.anything(Date),
            rev: expect.anything(Number),
        });
    },

    validateWarning(warningMap, expectedWarning) {
        let warning = warningMap[this.appCodePrefix(expectedWarning.code)];
        expect(warning).toBeDefined();
        expect(warning.type).toEqual("warning");
        expect(warning.message).toEqual(expectedWarning.message);
        if (warning.paramMap && expectedWarning.paramMap) {
            expect(warning.paramMap).toEqual(expectedWarning.paramMap);
        }
    },

    validateWarningWithoutParam(warningMap, expectedWarning) {
        let warning = warningMap[this.appCodePrefix(expectedWarning.code)];
        expect(warning).toBeDefined();
        expect(warning.type).toEqual("warning");
        expect(warning.message).toEqual(expectedWarning.message);
    },

    validateUnsupportedKeysWarning(response, expectedWarning) {
        expect(response.status).toEqual(200);
        let warning = response.uuAppErrorMap[this.appCodePrefix(expectedWarning.code)];
        let unSupportedKeyList = expectedWarning.unsupportedKeys.map((item) => `$.${item}`);
        expect(warning).toBeDefined();
        expect(warning.type).toEqual("warning");
        expect(warning.message).toEqual(expectedWarning.message);
        if (unSupportedKeyList.length > 0) {
            expect(warning.paramMap).toEqual(
                expect.objectContaining({
                    unsupportedKeyList: expect.arrayContaining(unSupportedKeyList),
                })
            );
        }
    },

    validateInvalidDtoIn(response, cmd) {
        expect(response.status).toEqual(400);
        expect(response.message).toEqual("DtoIn is not valid.");
        expect(response.code).toEqual(this.appCodePrefix(`${cmd}/invalidDtoIn`));
    },

    validateTokenAuthorizationFailed(response, cmd) {
        expect(response.status).toEqual(400);
        expect(response.message).toEqual("Authorizing the token failed.");
        expect(response.code).toEqual(this.appCodePrefix(`${cmd}/tokenAuthorizationFailed`));
    },

    validateError(response, expectedError) {
        expect(response.status).toEqual(400);
        expect(response.message).toEqual(expectedError.message);
        expect(response.code).toEqual(this.appCodePrefix(expectedError.code));
        if (response.paramMap && expectedError.paramMap) {
            expect(response.paramMap).toEqual(expectedError.paramMap);
        }
    },

    validateErrorNotAuthorized(response, expectedError) {
        expect(response.status).toEqual(403);
        expect(response.message).toEqual(expectedError.message);
        expect(response.code).toEqual(this.appCodePrefix(expectedError.code));
        if (response.paramMap && expectedError.paramMap) {
            expect(response.paramMap).toEqual(expectedError.paramMap);
        }
    },

    validateErrorDtoInParamMap(paramMap, expected) {
        expect(paramMap).toBeDefined();

        let invalidTypeKey = expected.type || expected.invalidTypeKey;
        if (invalidTypeKey) expect(paramMap.invalidTypeKeyMap[`$.${invalidTypeKey}`]).toBeDefined();

        let invalidValueKey = expected.value || expected.invalidValueKey;
        if (invalidValueKey) expect(paramMap.invalidValueKeyMap[`$.${invalidValueKey}`]).toBeDefined();

        let missingKey = expected.missing || expected.missingKey;
        if (missingKey) expect(paramMap.missingKeyMap[`$.${missingKey}`]).toBeDefined();
    },

    getUnsupportedKeysWarning(cmd) {
        return {
            code: `${cmd}/unsupportedKeys`,
            message: "DtoIn contains unsupported keys.",
            unsupportedKeys: [Object.keys(Helper.dtoIn.unsupportedKeys)],
        };
    },

    getInvalidDtoInError(cmd) {
        return {
            code: `${cmd}/invalidDtoIn`,
            message: "DtoIn is not valid.",
        };
    },
};

module.exports = ValidateHelper;