import { NowRequest, NowResponse } from "@vercel/node";
import { send } from "micro";
import { setupResponseData } from "../setup-response";
import { verifyAuth0Token, options } from "./verify-token";
import { handleVerifiedRequest } from "./handle-verified-requests";

export async function verifyRequest(
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  let statusCode = 200;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Accept, Content-Type",
    );
    if (request.method === "OPTIONS") {
      return send(response, statusCode);
    }
    if (!request.headers?.authorization) {
      statusCode = 401;
      return send(
        response,
        statusCode,
        setupResponseData({ message: "sorry not authorized :-(" }),
      );
    }
    const token = request.headers.authorization.split(" ")[1];
    const decoded = await verifyAuth0Token(token, options);

    if (decoded === undefined) {
      statusCode = 401;
      return send(
        response,
        statusCode,
        setupResponseData({ message: "sorry not authorized :-(" }),
      );
    } else {
      // token should be valid now
      await handleVerifiedRequest(request, response);
    }
    /*
    if (request.method !== "POST" && request.method !== "OPTIONS") {
      statusCode = 400;
      throw new Error(`you cant ${request.method} on this route`);
    }
    if (!request.body) {
      statusCode = 400;
      throw new Error("POST body not defined");
    }
    if (request.body.queryType === undefined) {
      statusCode = 400;
      throw new Error("POST body needs property queryType");
    }
    const {
      queryType,
      tree_id,
      uuid,
      username,
      amount,
    } = request.body as RequestBody;

    switch (queryType) {
      case "adopt":
        if (tree_id === undefined || uuid === undefined) {
          statusCode = 400;
          throw new Error(
            "POST body needs uuid (string) and tree_id (string) properties",
          );
        }
        result = await adoptTree(tree_id, uuid);
        break;

      case "water":
        if (
          tree_id === undefined ||
          uuid === undefined ||
          username === undefined ||
          amount === undefined
        ) {
          statusCode = 400;
          throw new Error(
            "POST body needs uuid (string), tree_id (string), username (string) and amount (number) properties",
          );
        }

        result = await waterTree({ tree_id, username, amount, uuid });
        break;
      default:
        statusCode = 400;
        throw new Error("Unknow POST body queryType");
    }
    const data = setupResponseData({
      url: request.url,
      data: result ? result : {},
    });
    return send(response, statusCode, data);
    */
  } catch (error) {
    statusCode = 500;
    let data = {};
    if (process.env.NODE_ENV === "development") {
      console.error(error);
      data = { ...setupResponseData({ error: error.message }) };
    }
    if (process.env.NODE_ENV === "test") {
      data = {};
    }
    if (process.env.NODE_ENV === "production") {
      data = { error: error.message };
    }
    return send(response, statusCode, data);
  }
}
