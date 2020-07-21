/* eslint-disable jest/no-hooks */
import * as manager from "./db-manager";
import getTrees from "../get-trees";
import * as micro from "micro";
import { Tree, TreeWatered, TreeReduced } from "./interfaces";

// jest.mock("./db-manager", () => {
//   return {
//     getTreesById: jest.fn().mockImplementation(() => {
//       return [];
//     }),
//   };
// });

jest.mock("./setup-response", () => {
  return {
    setupResponseData: jest.fn(),
  };
});

jest.mock("micro", () => {
  return { send: jest.fn() };
});
function setupRequest(overrides?: any) {
  const req = {
    query: {},
    ...overrides,
  };
  return req;
}
function setupResponse(overrides?: any) {
  const res = {
    query: {},
    ...overrides,
  };
  return res;
}
describe("test GET request handlers", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test("make request without queryType should return with 400", async () => {
    const req = setupRequest();
    const res = setupResponse();
    await getTrees(req, res);
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
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
      .mockImplementation((_id) => Promise.resolve({} as Tree));
    const req = setupRequest({ query: { queryType: "byid", id: "_abc" } });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getTreeById).toHaveBeenCalledWith("_abc");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });

  test("make lastwatered request get response back", async () => {
    jest
      .spyOn(manager, "getLastWateredTreeById")
      .mockImplementation((_id) => Promise.resolve([] as TreeWatered[]));
    const req = setupRequest({
      query: { queryType: "lastwatered", id: "_abc" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getLastWateredTreeById).toHaveBeenCalledWith("_abc");
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
    await getTrees(req, res);
    expect(manager.getLastWateredTreeById).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });
  test("make adopted request get response back", async () => {
    jest
      .spyOn(manager, "getAdoptedTreeIdsByUserId")
      .mockImplementation((_id) => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "adopted", uuid: "auth0|123" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getAdoptedTreeIdsByUserId).toHaveBeenCalledWith("auth0|123");
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
  });
  test("make adopted request get 400 response due to missing uuid", async () => {
    jest
      .spyOn(manager, "getAdoptedTreeIdsByUserId")
      .mockImplementation((_id) => Promise.resolve([] as string[]));
    const req = setupRequest({
      query: { queryType: "adopted" },
    });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getAdoptedTreeIdsByUserId).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 400, {});
  });

  test("make watered request get response back", async () => {
    jest
      .spyOn(manager, "getWateredTrees")
      .mockImplementation(() => Promise.resolve({ watered: [] as string[] }));
    const req = setupRequest({ query: { queryType: "watered" } });
    const res = setupResponse();
    await getTrees(req, res);
    expect(manager.getWateredTrees).toHaveBeenCalledTimes(1);
    expect(micro.send).toHaveBeenCalledWith(res, 200, undefined);
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

  test.each([
    [{ id: [], queryType: "foo" }],
    [{ uuid: [], queryType: "foo" }],
    [{ start: [], queryType: "foo" }],
    [{ end: [], queryType: "foo" }],
    [{ offset: [], queryType: "foo" }],
    [{ limit: [], queryType: "foo" }],

    [{ queryType: [] }],
  ])(
    "should create response with 400 due to %j beeing an array",
    async (item) => {
      const req = setupRequest({
        query: { ...item },
      });
      const res = setupResponse();
      await getTrees(req, res);
      expect(micro.send).toHaveBeenCalledWith(res, 400, {});
    },
  );
});
