/* eslint-disable @typescript-eslint/no-explicit-any */
import { send } from "micro";
import { NowRequest, NowResponse } from "@vercel/node";
import { setupResponseData } from "./_utils/setup-response";
import {
  getTreeById,
  getAllTrees,
  getTreesByAge,
  countTreesByAge,
  getTreesWateredAndAdopted,
  getTreesByids,
} from "./_utils/db/db-manager";
import { Tree } from "./_utils/common/interfaces";
import { verifyRequest } from "./_utils/auth/verify-request";

type GetQueryType =
  | "byid"
  | "all"
  | "adopted"
  | "lastwatered"
  | "watered"
  | "byage"
  | "countbyage"
  | "wateredbyuser"
  | "wateredandadopted"
  | "treesbyids"
  | "istreeadopted";

export default async function (
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  let statusCode = 200;
  if (request.method !== "GET" && request.method !== "OPTIONS") {
    statusCode = 400;
    throw new Error(`you cant ${request.method} on this route`);
  }
  try {
    const {
      id,
      queryType,
      countbyage,
      offset,
      limit,
      uuid,
      start,
      end,
      wateredbyuser,
      wateredandadopted,
      tree_ids,
    } = request.query;
    if (queryType === undefined) {
      statusCode = 200;
      return send(
        response,
        statusCode,
        setupResponseData({
          message:
            "api is alive (but you need to define a queryType for GET requests)",
        }),
      );
    }

    if (Array.isArray(id)) {
      statusCode = 400;
      throw new Error("id needs to be a string");
    }

    if (Array.isArray(queryType)) {
      statusCode = 400;
      throw new Error("queryType needs to be a string");
    }
    if (Array.isArray(uuid)) {
      statusCode = 400;
      throw new Error("uuid needs to be a string");
    }
    if (Array.isArray(tree_ids)) {
      statusCode = 400;
      throw new Error("tree_ids needs to be an string (e.g. '_abc,_def'");
    }
    // if (typeof tree_ids === "string") {
    //   statusCode = 400;
    //   throw new Error("tree_ids needs to be an array (e.g. '_abc,_def'");
    // }

    if (Array.isArray(countbyage)) {
      statusCode = 400;
      throw new Error("countbyage needs to be a string");
    }
    if (Array.isArray(wateredbyuser)) {
      statusCode = 400;
      throw new Error("wateredbyuser needs to be a string");
    }
    if (Array.isArray(wateredandadopted)) {
      statusCode = 400;
      throw new Error("wateredandadopted needs to be a string");
    }
    if (Array.isArray(start)) {
      statusCode = 400;
      throw new Error("start needs to be a string");
    }
    if (Array.isArray(end)) {
      statusCode = 400;
      throw new Error("end needs to be a string");
    }
    if (Array.isArray(offset) || Array.isArray(limit)) {
      statusCode = 400;
      throw new Error(
        "offset and limit need to be strings needs to be a string",
      );
    }
    //
    let result: any;
    switch (queryType as GetQueryType) {
      case "byid": {
        // can be public
        if (id === undefined) {
          statusCode = 400;
          throw new Error("id needs to be defiend");
        }
        // formaly get-trees
        result = (await getTreeById(id)) as Tree;
        // console.log(result.rows[0]);
        break;
      }
      case "byage": {
        // can be public
        if (start === undefined || end === undefined) {
          statusCode = 400;
          throw new Error("start and end need to be defiend");
        }
        if (parseInt(end, 10) < parseInt(start, 10)) {
          statusCode = 400;
          throw new Error("end cannot be smaller then start");
        }
        result = await getTreesByAge(start, end);
        break;
      }

      case "wateredandadopted": {
        // public
        result = await getTreesWateredAndAdopted();
        break;
      }
      case "treesbyids": {
        // public
        if (tree_ids === undefined) {
          statusCode = 400;
          throw new Error("tree_ids is not defined");
        }
        result = await getTreesByids(tree_ids);
        break;
      }
      case "countbyage": {
        // public
        if (start === undefined || end === undefined) {
          statusCode = 400;
          throw new Error("start and end need to be defiend");
        }
        result = await countTreesByAge(start, end);
        break;
      }
      case "all": {
        // public
        // formerly get-all-trees
        if (offset === undefined || limit === undefined) {
          statusCode = 400;
          throw new Error("offset and limit need to be defined");
        }
        result = await getAllTrees(offset, limit);
        break;
      }

      case "lastwatered":
      case "watered":
      case "wateredbyuser":
      case "istreeadopted":
      case "adopted": {
        await verifyRequest(request, response);
        return;
      }

      // PRIVATE
      // PRIVATE
      // PRIVATE
      // PRIVATE
      // case "watered": {
      //   // private has user id
      //   result = await getWateredTrees();
      //   break;
      // }
      // case "wateredbyuser": {
      //   // private
      //   if (uuid === undefined) {
      //     statusCode = 400;
      //     throw new Error("uuid is undefined");
      //   }
      //   result = await getTreesWateredByUser(uuid);
      //   break;
      // }
      // case "istreeadopted":
      //   // private
      //   if (id === undefined || uuid === undefined) {
      //     statusCode = 400;
      //     throw new Error("id or uuid are not defined");
      //   }
      //   result = await isTreeAdoptedByUser(uuid, id);
      //   break;
      // case "adopted": {
      //   // private
      //   // formerly get-adopted-trees
      //   if (uuid === undefined) {
      //     statusCode = 400;
      //     throw new Error("uuid needs to be defiend");
      //   }
      //   result = await getAdoptedTreeIdsByUserId(uuid);
      //   break;
      // }

      default:
        statusCode = 400;
        throw new Error("no default case defined");
    }
    if (result === undefined) {
      statusCode = 500;
      throw new Error("could not get result from db query");
    }
    // TODO: Fix frontend to not rely on top level objects
    const data = setupResponseData({
      url: request.url,
      data: result ? result : {},
    });
    return send(response, statusCode, data);
  } catch (error) {
    let data = {};
    if (process.env.NODE_ENV === "development") {
      console.error(error);
      data = { ...setupResponseData({ error: JSON.stringify(error) }) };
    }
    if (process.env.NODE_ENV === "test") {
      data = {};
    }
    if (process.env.NODE_ENV === "production") {
      data = { message: error.message };
    }
    return send(response, statusCode, data);
  }
}
