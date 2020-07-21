import { NowResponse, NowRequest } from "@vercel/node";
import { setupResponseData } from "../setup-response";
import { send } from "micro";
import { RequestBody } from "../interfaces";
import {
  adoptTree,
  waterTree,
  getWateredTrees,
  getTreesWateredByUser,
  isTreeAdoptedByUser,
  getAdoptedTreeIdsByUserId,
  getLastWateredTreeById,
} from "../db-manager";

export async function handleVerifiedRequest(
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  let statusCode = 200;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;
  try {
    switch (request.method) {
      case "GET": {
        const { id, queryType, uuid } = request.query;
        if (queryType === undefined) {
          statusCode = 400;
          throw new Error("queryType is not defined");
        }
        if (Array.isArray(queryType)) {
          statusCode = 400;
          throw new Error("queryType needs to be a string");
        }
        statusCode = 200;
        if (Array.isArray(uuid)) {
          statusCode = 400;
          throw new Error("uuid needs to be a string");
        }
        if (Array.isArray(id)) {
          statusCode = 400;
          throw new Error("id needs to be a string");
        }
        switch (queryType) {
          case "watered": {
            // private has user id
            result = await getWateredTrees();
            break;
          }
          case "wateredbyuser": {
            // private
            if (uuid === undefined) {
              statusCode = 400;
              throw new Error("uuid is undefined");
            }
            result = await getTreesWateredByUser(uuid);
            break;
          }
          case "lastwatered": {
            // private
            if (id === undefined) {
              statusCode = 400;
              throw new Error("id is undefined");
            }
            result = await getLastWateredTreeById(id);
            break;
          }
          case "istreeadopted":
            // private
            if (id === undefined || uuid === undefined) {
              statusCode = 400;
              throw new Error("id or uuid are not defined");
            }
            result = await isTreeAdoptedByUser(uuid, id);
            break;
          case "adopted": {
            // private
            // formerly get-adopted-trees
            if (uuid === undefined) {
              statusCode = 400;
              throw new Error("uuid needs to be defiend");
            }
            result = await getAdoptedTreeIdsByUserId(uuid);
            break;
          }
        }
        const data = setupResponseData({
          url: request.url,
          data: result ? result : {},
        });
        return send(response, statusCode, data);
        break;
      }
      case "POST": {
        let result: string;
        statusCode = 201;

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
      }
      case "DELETE": {
        break;
      }
      default: {
        send(
          response,
          404,
          setupResponseData({
            message: `no response defiend for method ${request.method}`,
          }),
        );
      }
    }
  } catch (error) {
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
