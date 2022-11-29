/* eslint-disable jest/no-hooks */
/* eslint-disable jest/require-top-level-describe */
import * as requests from "./handle-verified-requests";
import * as micro from "micro";
import { verifyRequest } from "./verify-request";
import { setupRequest, setupResponse } from "../../__test-utils";
import * as auth from "./verify-token";
import { setupResponseData } from "../setup-response";
jest.mock("micro", () => {
  return { send: jest.fn() };
});
jest.mock("./verify-token", () => {
  return {
    verifyAuth0Token: jest.fn().mockImplementation(() => {
      return Promise.resolve("token");
    }),
  };
});
jest.mock("./handle-verified-requests", () => {
  return {
    handleVerifiedRequest: jest.fn().mockImplementation(() => {
      return Promise.resolve();
    }),
  };
});
jest.mock("../envs", () => {
  return {
    getEnvs: () => {
      return {
        PG_USER: process.env.user ? process.env.user : "postgres",
        PG_DATABASE: process.env.database ? process.env.database : "postgres",
        PG_PASSWORD: process.env.password ? process.env.password : "postgres",
        PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 54322,
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

describe("verifing requests", () => {
  test("should call micro.send with statuscode 200 due to OPTIONS method", async () => {
    const req = setupRequest({
      method: "OPTIONS",
      headers: { authorization: "Bearer foo" },
    });
    const res = setupResponse({ setHeader: jest.fn() });
    await verifyRequest(req, res);
    expect(auth.verifyAuth0Token).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(res, 200);
    expect(requests.handleVerifiedRequest).not.toHaveBeenCalled();
  });

  test("should call micro.send with statuscode 401 due to missing authorization header method", async () => {
    const req = setupRequest({
      method: "GET",
      headers: {},
    });
    const res = setupResponse({ setHeader: jest.fn() });
    await verifyRequest(req, res);
    expect(auth.verifyAuth0Token).not.toHaveBeenCalled();
    expect(micro.send).toHaveBeenCalledWith(
      res,
      401,
      setupResponseData({
        message: "sorry not authorized :-(",
      }),
    );
    expect(requests.handleVerifiedRequest).not.toHaveBeenCalled();
  });
  test("should call micro.send with statuscode 401 due to missing verifyAuth0Token returning undefined", async () => {
    jest.spyOn(auth, "verifyAuth0Token").mockImplementationOnce(() => {
      return Promise.resolve(undefined);
    });
    const req = setupRequest({
      method: "GET",
      headers: { authorization: "Bearer foo" },
    });
    const res = setupResponse({ setHeader: jest.fn() });
    await verifyRequest(req, res);
    expect(auth.verifyAuth0Token).toHaveBeenCalledWith("foo", undefined);
    expect(micro.send).toHaveBeenCalledWith(
      res,
      401,
      setupResponseData({
        message: "sorry not authorized :-(",
      }),
    );
    expect(requests.handleVerifiedRequest).not.toHaveBeenCalled();
  });
  test("should call handleVerifiedRequest", async () => {
    const req = setupRequest({ headers: { authorization: "Bearer foo" } });
    const res = setupResponse({ setHeader: jest.fn() });
    await verifyRequest(req, res);
    expect(auth.verifyAuth0Token).toHaveBeenCalledWith("foo", undefined);
    expect(micro.send).not.toHaveBeenCalled();
    expect(requests.handleVerifiedRequest).toHaveBeenCalledWith(req, res);
  });
  test("should handle thrown errors handleVerifiedRequest", async () => {
    jest.spyOn(requests, "handleVerifiedRequest").mockImplementationOnce(() => {
      return Promise.reject();
    });
    const req = setupRequest({ headers: { authorization: "Bearer foo" } });
    const res = setupResponse({ setHeader: jest.fn() });
    await verifyRequest(req, res);
    expect(auth.verifyAuth0Token).toHaveBeenCalledWith("foo", undefined);
    expect(micro.send).toHaveBeenCalledWith(res, 500, {});
    expect(requests.handleVerifiedRequest).toHaveBeenCalledWith(req, res);
  });
});
