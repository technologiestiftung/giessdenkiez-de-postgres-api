import { RequestMethod } from "./../common/types";
import { VercelResponse, VercelRequest } from "@vercel/node";
import { setupResponseData } from "../setup-response";
import { send } from "micro";
import { RequestBody } from "../common/interfaces";
import {
  adoptTree,
  waterTree,
  getTreesWateredByUser,
  isTreeAdoptedByUser,
  getAdoptedTreeIdsByUserId,
  // getLastWateredTreeById,
  unadoptTree,
  unwaterTree,
} from "../db/db-manager";
import { errorHandler } from "../error-handler";

type ValidationType = "string" | "number";

const validateType = (
  value: unknown,
  method: RequestMethod,
  paramName: string,
  type: ValidationType,
) => {
  if (typeof value !== type) {
    throw new Error(`${method} body param "${paramName}" must be a ${type}`);
  }
};

const validateString = (
  value: unknown,
  method: RequestMethod,
  paramName: string,
) => {
  validateType(value, method, paramName, "string");
};

const validateNumber = (
  value: unknown,
  method: RequestMethod,
  paramName: string,
) => {
  validateType(value, method, paramName, "number");
};

export async function handleVerifiedRequest(
  request: VercelRequest,
  response: VercelResponse,
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
          case "wateredbyuser": {
            // private
            if (uuid === undefined) {
              statusCode = 400;
              throw new Error("uuid is undefined");
            }
            result = await getTreesWateredByUser(uuid as string);
            break;
          }
          case "istreeadopted":
            // private
            try {
              validateString(id, request.method, "id");
              validateString(uuid, request.method, "uuid");
            } catch (error) {
              statusCode = 400;
              throw error;
            }
            result = await isTreeAdoptedByUser(uuid as string, id as string);
            break;
          case "adopted": {
            // private
            // formerly get-adopted-trees
            try {
              validateString(uuid, request.method, "uuid");
            } catch (error) {
              statusCode = 400;
              throw error;
            }
            result = await getAdoptedTreeIdsByUserId(uuid as string);
            break;
          }
        }
        const data = setupResponseData({
          url: request.url,
          data: result !== undefined ? result : {},
        });
        return send(response, statusCode, data);
      }
      case "POST": {
        let result: string;
        statusCode = 201;

        if (request.body.queryType === undefined) {
          statusCode = 400;
          throw new Error("POST body needs property queryType");
        }
        const {
          queryType,
          tree_id,
          timestamp,
          uuid,
          username,
          amount,
        } = request.body as RequestBody;

        switch (queryType) {
          case "adopt":
            try {
              validateString(tree_id, request.method, "tree_id");
              validateString(uuid, request.method, "uuid");
            } catch (error) {
              statusCode = 400;
              throw error;
            }

            result = await adoptTree(tree_id as string, uuid as string);
            break;

          case "water":
            try {
              validateString(tree_id, request.method, "tree_id");
              validateString(uuid, request.method, "uuid");
              validateString(username, request.method, "username");
              validateString(timestamp, request.method, "timestamp");
              validateNumber(amount, request.method, "amount");
            } catch (error) {
              statusCode = 400;
              throw error;
            }

            result = await waterTree({
              tree_id: tree_id as string,
              username: username as string,
              amount: amount as number,
              uuid: uuid as string,
              timestamp: timestamp as string,
            });
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
        if (request.body.queryType === undefined) {
          statusCode = 400;
          throw new Error("DELETE body needs property queryType");
        }
        const {
          watering_id,
          queryType,
          tree_id,
          uuid,
        } = request.body as RequestBody;

        switch (queryType) {
          case "unadopt":
            try {
              validateString(tree_id, request.method, "tree_id");
              validateString(uuid, request.method, "uuid");
            } catch (error) {
              statusCode = 400;
              throw error;
            }

            result = await unadoptTree(tree_id as string, uuid as string);
            break;
          case "unwater":
            try {
              validateNumber(watering_id, request.method, "watering_id");
              validateString(tree_id, request.method, "tree_id");
              validateString(uuid, request.method, "uuid");
            } catch (error) {
              statusCode = 400;
              throw error;
            }
            result = await unwaterTree(
              watering_id as number,
              tree_id as string,
              uuid as string,
            );
            break;
          default:
            statusCode = 400;
            throw new Error("Unknow DELETE body queryType");
        }
        const data = setupResponseData({
          url: request.url,
          data: result ? result : {},
        });
        return send(response, statusCode, data);
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
    await errorHandler({ response, error: error as Error, statusCode }).catch(
      (err) => err,
    );
    return;
  }
}
