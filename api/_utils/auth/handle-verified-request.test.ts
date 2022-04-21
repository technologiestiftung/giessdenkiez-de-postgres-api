/* eslint-disable jest/require-top-level-describe */
import {
  VerifiedReqCaseOptionPOST,
  VerifiedReqCaseOptionGET,
} from "../common/interfaces";
/* eslint-disable jest/no-hooks */
import * as manager from "../db/db-manager";
import * as micro from "micro";
import { TreeWatered } from "../common/interfaces";
import { setupRequest, setupResponse } from "../../__test-utils";
import { handleVerifiedRequest } from "./handle-verified-requests";
import cases from "jest-in-case";
import {
  caseCollectionPOST,
  caseCollectionGET,
} from "../../__test-utils/handle-verified-request-test-cases";

jest.mock("../setup-response", () => {
  return {
    setupResponseData: jest.fn(),
  };
});

jest.mock("micro", () => {
  return { send: jest.fn() };
});
jest.mock("../envs", () => {
  return {
    getEnvs: () => {
      return {
        PG_USER: process.env.user ? process.env.user : "fangorn",
        PG_DATABASE: process.env.database ? process.env.database : "trees",
        PG_PASSWORD: process.env.password ? process.env.password : "ent",
        PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 5432,
        PG_HOST: process.env.host ? process.env.host : "localhost",
        jwksUri: "",
        audience: "",
        issuer: "",
      };
    },
  };
});

beforeEach(() => jest.clearAllMocks());
afterAll(() => {
  jest.restoreAllMocks();
});
describe("verified request test", () => {
  // eslint-disable-next-line jest/no-commented-out-tests

  test.each([
    [{}],
    [{ queryType: [] }],
    [{ id: [], queryType: "foo" }],
    [{ uuid: [], queryType: "foo" }],
  ])(
    "should create response with 400 due to %j beeing an array",
    async (item) => {
      const req = setupRequest({
        query: { ...item },
      });
      const res = setupResponse();
      await handleVerifiedRequest(req, res);
      expect(micro.send).toHaveBeenCalledWith(res, 400, {});
    },
  );
});

/**
 * Test function to run multiple test cases with jest-in-case
 *
 */
const testerPOST_DELETE: (
  opts: VerifiedReqCaseOptionPOST,
) => Promise<void> = async ({ queryType, body, statusCode, data, method }) => {
  switch (queryType) {
    case "unadopt": {
      jest
        .spyOn(manager, "unadoptTree")
        .mockImplementation(() => Promise.resolve("unadopted"));
      break;
    }
    case "unwater": {
      jest
        .spyOn(manager, "unwaterTree")
        .mockImplementation(() => Promise.resolve("unwatered"));
      break;
    }
    case "adopt":
      jest
        .spyOn(manager, "adoptTree")
        .mockImplementation(() => Promise.resolve("adopted"));
      break;
    case "water":
      jest
        .spyOn(manager, "waterTree")
        .mockImplementation(() => Promise.resolve("watered"));
      break;
  }
  const req = setupRequest({
    body: { ...body, queryType },
    method,
  });
  const res = setupResponse();
  await handleVerifiedRequest(req, res);
  expect(micro.send).toHaveBeenCalledWith(res, statusCode, data);
  switch (queryType) {
    case "water": {
      if (statusCode === 201) {
        expect(manager.waterTree).toHaveBeenCalledWith({
          tree_id: req.body.tree_id,
          timestamp: req.body.timestamp,
          uuid: req.body.uuid,
          amount: req.body.amount,
          username: req.body.username,
        });
      } else {
        expect(manager.waterTree).not.toHaveBeenCalled();
      }
      break;
    }
    case "unadopt": {
      if (statusCode === 200) {
        expect(manager.unadoptTree).toHaveBeenCalledWith(
          req.body.tree_id,
          req.body.uuid,
        );
      } else {
        expect(manager.unadoptTree).not.toHaveBeenCalled();
      }
      break;
    }
    case "unwater": {
      if (statusCode === 200) {
        expect(manager.unwaterTree).toHaveBeenCalledWith(
          req.body.watering_id,
          req.body.tree_id,
          req.body.uuid,
        );
      } else {
        expect(manager.unwaterTree).not.toHaveBeenCalled();
      }
      break;
    }
    case "adopt": {
      if (statusCode === 201) {
        expect(manager.adoptTree).toHaveBeenCalledWith(
          req.body.tree_id,
          req.body.uuid,
        );
      } else {
        expect(manager.adoptTree).not.toHaveBeenCalled();
      }
      break;
    }
  }
};

const testerGET: (opts: VerifiedReqCaseOptionGET) => Promise<void> = async ({
  queryType,
  query,
  statusCode,
  data,
  method,
}) => {
  switch (queryType) {
    case "istreeadopted": {
      jest
        .spyOn(manager, "isTreeAdoptedByUser")
        .mockImplementation((_uuid, _id) => Promise.resolve(true));
      break;
    }
    case "lastwatered": {
      jest
        .spyOn(manager, "getLastWateredTreeById")
        .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
      break;
    }
    case "wateredbyuser": {
      jest
        .spyOn(manager, "getTreesWateredByUser")
        .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
      break;
    }
    case "adopted": {
      jest
        .spyOn(manager, "getAdoptedTreeIdsByUserId")
        .mockImplementation((_id) => Promise.resolve([] as string[]));
      break;
    }
    case "watered": {
      jest
        .spyOn(manager, "getWateredTrees")
        .mockImplementation(() =>
          Promise.resolve({ watered: [] } as { watered: string[] }),
        );
      break;
    }
  }
  const req = setupRequest({
    query: { queryType, ...query },
    method,
  });

  const res = setupResponse();
  await handleVerifiedRequest(req, res);
  expect(micro.send).toHaveBeenCalledWith(res, statusCode, data);
  switch (queryType) {
    case "istreeadopted": {
      if (statusCode === 200) {
        expect(manager.isTreeAdoptedByUser).toHaveBeenCalledWith(
          query.uuid,
          query.id,
        );
      } else {
        expect(manager.isTreeAdoptedByUser).not.toHaveBeenCalled();
      }
      break;
    }
    case "lastwatered": {
      if (statusCode === 200) {
        expect(manager.getLastWateredTreeById).toHaveBeenCalledWith(query.id);
      } else {
        expect(manager.getLastWateredTreeById).not.toHaveBeenCalled();
      }
      break;
    }
    case "watered": {
      if (statusCode === 200) {
        expect(manager.getWateredTrees).toHaveBeenCalledWith();
      } else {
        expect(manager.getWateredTrees).not.toHaveBeenCalled();
      }
      break;
    }

    case "wateredbyuser": {
      if (statusCode === 200) {
        expect(manager.getTreesWateredByUser).toHaveBeenCalledWith(query.uuid);
      } else {
        expect(manager.getTreesWateredByUser).not.toHaveBeenCalled();
      }
      break;
    }
    case "adopted": {
      if (statusCode === 200) {
        expect(manager.getAdoptedTreeIdsByUserId).toHaveBeenCalledWith(
          query.uuid,
        );
      } else {
        expect(manager.getAdoptedTreeIdsByUserId).not.toHaveBeenCalled();
      }
      break;
    }
  }
};

cases("should make:", testerPOST_DELETE, caseCollectionPOST);
cases("should make GET request to:", testerGET, caseCollectionGET);
