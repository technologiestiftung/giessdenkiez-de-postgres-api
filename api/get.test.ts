/* eslint-disable jest/no-standalone-expect */
/* eslint-disable jest/require-top-level-describe */
/* eslint-disable jest/no-hooks */
import * as manager from "./_utils/db/db-manager";
import getTrees from "./get";
import * as micro from "micro";

import { Tree, TreeWatered, TreeReduced } from "./_utils/common/interfaces";
import * as verifyToken from "./_utils/auth/verify-token";
import * as handler from "./_utils/auth/verify-request";
import { setupRequest, setupResponse } from "./__test-utils";
import cases from "jest-in-case";
// jest.mock("./db-manager", () => {
//   return {
//     getTreesById: jest.fn().mockImplementation(() => {
//       return [];
//     }),
//   };
// });
jest.mock("./_utils/auth/verify-request");
jest.mock("./_utils/auth/verify-token", () => {
  return {
    verifyAuth0Token: jest.fn(),
  };
});
jest.mock("./_utils/envs", () => {
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

jest.mock("./_utils/setup-response", () => {
  return {
    setupResponseData: jest.fn(),
  };
});

jest.mock("micro", () => {
  return { send: jest.fn() };
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any

beforeEach(() => jest.clearAllMocks());
afterAll(() => {
  jest.restoreAllMocks();
});
describe("test GET request handlers", () => {
  test("make request without queryType should return with 200", async () => {
    const req = setupRequest();
    const res = setupResponse();
    await getTrees(req, res);
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  test("make byid request without id should return with 400", async () => {
    const req = setupRequest({ query: { queryType: "byid" } });
    const res = setupResponse();
    await getTrees(req, res);
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make byid request get response back", async () => {
    jest
      .spyOn(manager, "getTreeById")
      .mockImplementation((_id) => Promise.resolve([] as Tree[]));
    const req = setupRequest({ query: { queryType: "byid", id: "_abc" } });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getTreeById).toHaveBeenCalledWith("_abc");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });

  test("make lastwatered request call verifyHandler", async () => {
    jest
      .spyOn(verifyToken, "verifyAuth0Token")
      .mockImplementation(() => Promise.resolve({ token: "foo" }));

    jest
      .spyOn(manager, "getLastWateredTreeById")
      .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
    const req = setupRequest({
      headers: { authorization: "Bearer xyz" },
      query: { queryType: "lastwatered", id: "_abc" },
    });

    const res = setupResponse();
    await getTrees(req, res);
    // expect(manager.getLastWateredTreeById).toHaveBeenCalledWith("_abc");
    expect(handler.verifyRequest).toHaveBeenCalledWith(req, res);
    // expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });

  test("make adopted request get response back", async () => {
    // jest
    //   .spyOn(manager, "getAdoptedTreeIdsByUserId")
    //   .mockImplementation((_id) => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "adopted", uuid: "auth0|123" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(handler.verifyRequest).toHaveBeenCalledWith(req, res);

    // expect(manager.getAdoptedTreeIdsByUserId).toHaveBeenCalledWith("auth0|123");
    // expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  // test("make adopted request get 400 response due to missing uuid", async () => {
  //   jest
  //     .spyOn(manager, "getAdoptedTreeIdsByUserId")
  //     .mockImplementation((_id) => Promise.resolve([] as string[]));
  //   const req = setupRequest({
  //     query: { queryType: "adopted" },
  //   });
  //   const res = setupResponse();
  //   await getTrees(req, res);
  //   expect(manager.getAdoptedTreeIdsByUserId).not.toHaveBeenCalled();
  //   expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  // });

  test("make watered request get response back", async () => {
    // jest
    //   .spyOn(manager, "getWateredTrees")
    //   .mockImplementation(() => Promise.resolve({ watered: [] as string[] }));
    const req = setupRequest({ query: { queryType: "watered" } });
    const res = setupResponse();
    await getTrees(req, res);
    // expect(manager.getWateredTrees).toHaveBeenCalledTimes(1);
    expect(handler.verifyRequest).not.toHaveBeenCalledWith(req, res);

    // expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  test("make all request get response back", async () => {
    jest
      .spyOn(manager, "getAllTrees")
      .mockImplementation((_offset, _limit) =>
        Promise.resolve({ watered: [] as TreeReduced[] }),
      );
    const req = setupRequest({
      query: { queryType: "all", offset: "1", limit: "1" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getAllTrees).toHaveBeenCalledTimes(1);
    expect(manager.getAllTrees).toHaveBeenCalledWith("1", "1");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  test("make all request get back 400 due to missing offset", async () => {
    jest
      .spyOn(manager, "getAllTrees")
      .mockImplementation((_offset, _limit) =>
        Promise.resolve({ watered: [] as TreeReduced[] }),
      );
    const req = setupRequest({
      query: { queryType: "all", limit: "1" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getAllTrees).toHaveBeenCalledTimes(0);
    expect(manager.getAllTrees).not.toHaveBeenCalledWith("1", "1");
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make all request get back 400 due to missing limit", async () => {
    jest
      .spyOn(manager, "getAllTrees")
      .mockImplementation((_offset, _limit) =>
        Promise.resolve({ watered: [] as TreeReduced[] }),
      );
    const req = setupRequest({
      query: { queryType: "all", offset: "1" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getAllTrees).toHaveBeenCalledTimes(0);
    expect(manager.getAllTrees).not.toHaveBeenCalledWith("1", "1");
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make byage request get response back", async () => {
    jest
      .spyOn(manager, "getTreesByAge")
      .mockImplementation(() => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "byage", start: "1800", end: "1800" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getTreesByAge).toHaveBeenCalledTimes(1);
    expect(manager.getTreesByAge).toHaveBeenCalledWith("1800", "1800");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  test("make byage request get 400 due to missing start query", async () => {
    jest
      .spyOn(manager, "getTreesByAge")
      .mockImplementation(() => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "byage", end: "1800" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getTreesByAge).toHaveBeenCalledTimes(0);
    expect(manager.getTreesByAge).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make byage request get 400 due to missing end query", async () => {
    jest
      .spyOn(manager, "getTreesByAge")
      .mockImplementation(() => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "byage", start: "1800" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getTreesByAge).toHaveBeenCalledTimes(0);
    expect(manager.getTreesByAge).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make byage request get 400 due end beeing smaller then start", async () => {
    jest
      .spyOn(manager, "getTreesByAge")
      .mockImplementation(() => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "byage", start: "1800", end: "1799" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getTreesByAge).toHaveBeenCalledTimes(0);
    expect(manager.getTreesByAge).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });

  test("make request with non existing queryType get response 400 back", async () => {
    const req = setupRequest({ query: { queryType: "foo" } });
    const res = setupResponse();
    await getTrees(req, res);
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });

  test("make all request get back 500 due to undefined result", async () => {
    jest
      .spyOn(manager, "getAllTrees")
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      .mockImplementation((_offset, _limit) => Promise.resolve(undefined));
    const req = setupRequest({
      query: { queryType: "all", offset: "1", limit: "1" },
    });
    const res = setupResponse();
    await getTrees(req, res);

    expect(micro.send).toHaveBeenCalledWith(res, 500, {});
  });
});
cases(
  "make requests:",
  async (opts) => {
    const req = setupRequest({ method: opts.method, query: opts.query });
    const res = setupResponse();
    await getTrees(req, res);

    expect(micro.send).toHaveBeenCalledWith(res, opts.statusCode, {});
  },
  [
    {
      name: "not GET returns 400",
      method: "POST",
      query: { queryType: "foo", tree_ids: [] },
      statusCode: 400,
    },
    // [{ start: [], queryType: "foo" }],
    // [{ end: [], queryType: "foo" }],
    // [{ offset: [], queryType: "foo" }],
    // [{ limit: [], queryType: "foo" }],
    {
      name: "queryType\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: [] },
      statusCode: 400,
    },
    {
      name: "limit\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", limit: [] },
      statusCode: 400,
    },
    {
      name: "offset\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", offset: [] },
      statusCode: 400,
    },
    {
      name: "end\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", end: [] },
      statusCode: 400,
    },
    {
      name: "start\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", start: [] },
      statusCode: 400,
    },
    {
      name: "uuid\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", uuid: [] },
      statusCode: 400,
    },
    {
      name: "id\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", id: [] },
      statusCode: 400,
    },
    {
      name: "tree_id\t\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", tree_ids: [] },
      statusCode: 400,
    },
    {
      name: "countbyage\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", countbyage: [] },
      statusCode: 400,
    },
    {
      name: "wateredbyuser\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", wateredbyuser: [] },
      statusCode: 400,
    },
    {
      name: "wateredandadopted\tneeds to be a string not array returns 400",
      method: "GET",
      query: { queryType: "foo", wateredandadopted: [] },
      statusCode: 400,
    },
  ],
);
