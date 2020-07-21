/* eslint-disable @typescript-eslint/no-explicit-any */
import { send } from "micro";
import { NowRequest, NowResponse } from "@vercel/node";
import { setupResponseData } from "./_utils/setup-response";
import {
  getTreeById,
  getAllTrees,
  getAdoptedTreeIdsByUserId,
  getLastWateredTreeById,
  getTreesByAge,
  getWateredTrees,
} from "./_utils/db-manager";
import { Tree } from "./_utils/interfaces";

type QueryType =
  | "byid"
  | "all"
  | "adopted"
  | "lastwatered"
  | "watered"
  | "byage";

export default async function (
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  let statusCode = 200;
  try {
    const { id, queryType, offset, limit, uuid, start, end } = request.query;

    if (queryType === undefined) {
      statusCode = 400;
      throw new Error("queryType needs to defiend");
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
    let result: Tree | any;
    switch (queryType as QueryType) {
      case "byid":
        if (id === undefined) {
          statusCode = 400;
          throw new Error("id needs to be defiend");
        }
        // formaly get-trees
        result = (await getTreeById(id)) as Tree;
        // console.log(result.rows[0]);
        break;
      case "watered":
        result = await getWateredTrees();
        break;
      case "byage":
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
      case "lastwatered":
        if (id === undefined) {
          statusCode = 400;
          throw new Error("id is undefined");
        }
        result = await getLastWateredTreeById(id);
        break;
      case "adopted":
        // formerly get-adopted-trees
        if (uuid === undefined) {
          statusCode = 400;
          throw new Error("uuid needs to be defiend");
        }
        result = await getAdoptedTreeIdsByUserId(uuid);
        break;
      case "all":
        // formerly get-all-trees
        if (offset === undefined || limit === undefined) {
          statusCode = 400;
          throw new Error("offset and limit need to be defined");
        }
        result = await getAllTrees(offset, limit);
        break;
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
      data = { ...setupResponseData({ error: JSON.stringify(error) }) };
    }
    if (process.env.NODE_ENV === "test") {
      data = {};
    }
    return send(response, statusCode, data);
  }
}
