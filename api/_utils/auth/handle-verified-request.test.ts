/* eslint-disable jest/no-hooks */
import * as manager from "../db-manager";
import * as micro from "micro";
import { TreeWatered } from "../interfaces";
import { setupRequest, setupResponse } from "../../__test-utils";
import { handleVerifiedRequest } from "./handle-verified-requests";

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

describe("verified request test", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => {
    jest.restoreAllMocks();
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  test("make watered request get response back", async () => {
    jest
      .spyOn(manager, "getWateredTrees")
      .mockImplementation(() => Promise.resolve({ watered: [] as string[] }));
    const req = setupRequest({ query: { queryType: "watered" } });
    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.getWateredTrees).toHaveBeenCalledTimes(1);

    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });

  test("make lastwatered request get 400 response due to missing id", async () => {
    jest
      .spyOn(manager, "getLastWateredTreeById")
      .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
    const req = setupRequest({
      query: { queryType: "lastwatered" },
    });
    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.getLastWateredTreeById).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make wateredbyuser request get 400 response due to missing id", async () => {
    jest
      .spyOn(manager, "getTreesWateredByUser")
      .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
    const req = setupRequest({
      query: { queryType: "wateredbyuser" },
    });
    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.getTreesWateredByUser).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make wateredbyuser request get 200 response due to missing id", async () => {
    jest
      .spyOn(manager, "getTreesWateredByUser")
      .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
    const req = setupRequest({
      query: { queryType: "wateredbyuser", uuid: "auth0|123" },
    });
    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.getTreesWateredByUser).toHaveBeenCalledWith("auth0|123");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  test("make lastwatered request call", async () => {
    jest
      .spyOn(manager, "getLastWateredTreeById")
      .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
    const req = setupRequest({
      headers: { authorization: "Bearer xyz" },
      query: { queryType: "lastwatered", id: "_abc" },
    });

    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.getLastWateredTreeById).toHaveBeenCalledWith("_abc");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
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
