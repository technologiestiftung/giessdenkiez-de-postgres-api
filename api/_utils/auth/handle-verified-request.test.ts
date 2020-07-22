/* eslint-disable jest/no-hooks */
import * as manager from "../db/db-manager";
import * as micro from "micro";
import { TreeWatered, TreeAdopted } from "../common/interfaces";
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

  test("make GET lastwatered request get 400 response due to missing id", async () => {
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
  test("make GET wateredbyuser request get 400 response due to missing id", async () => {
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
  test("make GET wateredbyuser request get 200 response due to missing id", async () => {
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
  test("make GET lastwatered request call", async () => {
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
  test("make GET istreeadopted request call return 400 due to mising uuid", async () => {
    jest
      .spyOn(manager, "isTreeAdoptedByUser")
      .mockImplementation((_id) => Promise.resolve([] as TreeAdopted[]));
    const req = setupRequest({
      headers: { authorization: "Bearer xyz" },
      query: { queryType: "istreeadopted", id: "_abc" },
    });

    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.isTreeAdoptedByUser).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make GET istreeadopted request call return 400 due to missing uuid", async () => {
    jest
      .spyOn(manager, "isTreeAdoptedByUser")
      .mockImplementation((_id) => Promise.resolve([] as TreeAdopted[]));
    const req = setupRequest({
      headers: { authorization: "Bearer xyz" },
      query: { queryType: "istreeadopted", uuid: "auth|123" },
    });

    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.isTreeAdoptedByUser).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });

  test("make GET istreeadopted request call return 200", async () => {
    jest
      .spyOn(manager, "isTreeAdoptedByUser")
      .mockImplementation((_uuid, _id) => Promise.resolve([] as TreeAdopted[]));
    const req = setupRequest({
      headers: { authorization: "Bearer xyz" },
      query: { queryType: "istreeadopted", uuid: "auth0|123", id: "_abc" },
    });

    const res = setupResponse();
    await handleVerifiedRequest(req, res);
    expect(manager.isTreeAdoptedByUser).toHaveBeenCalledWith(
      "auth0|123",
      "_abc",
    );
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });

  test.todo("Make request to GET adopted query");
  // POST requests
  test.todo("make POST request without body should return 400");

  test.each([
    ["adopt", {}, 400, {}],
    ["adopt", { uuid: "auth0|123" }, 400, {}],
    ["adopt", { tree_id: "_abc" }, 400, {}],
    ["adopt", { uuid: "auth0|123", tree_id: "_abc" }, 201, undefined],

    ["water", { query: {} }, 400, {}],
    [
      "water",
      {
        tree_id: "_abc",
        amount: 100,
        uuid: "auth0|123",
      },
      400,
      {},
    ],
    [
      "water",
      {
        username: "foo",
        amount: 100,
        uuid: "auth0|123",
      },
      400,
      {},
    ],
    [
      "water",
      {
        username: "foo",
        tree_id: "_abc",
        uuid: "auth0|123",
      },
      400,
      {},
    ],
    [
      "water",
      {
        username: "foo",
        tree_id: "_abc",
        amount: 100,
      },
      400,
      {},
    ],
    [
      "water",
      {
        username: "foo",
        tree_id: "_abc",
        amount: 100,
        uuid: "auth0|123",
      },
      201,
      undefined,
    ],
  ])(
    "should make POST request to %s with body %j and answer with %i",
    async (queryType, body, statusCode, data) => {
      switch (queryType) {
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
        method: "POST",
      });
      const res = setupResponse();
      await handleVerifiedRequest(req, res);
      expect(micro.send).toHaveBeenCalledWith(res, statusCode, data);
      switch (queryType) {
        case "water":
          if (statusCode === 201) {
            expect(manager.waterTree).toHaveBeenCalledWith(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              {
                tree_id: req.body.tree_id,
                uuid: req.body.uuid,
                amount: req.body.amount,
                username: req.body.username,
              },
            );
          } else {
            expect(manager.waterTree).not.toHaveBeenCalled();
          }
          break;
        case "adopt":
          if (statusCode === 201) {
            expect(manager.adoptTree).toHaveBeenCalledWith(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              req.body.tree_id,
              req.body.uuid,
            );
          } else {
            expect(manager.adoptTree).not.toHaveBeenCalled();
          }
          break;
      }
    },
  ),
    // );

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
