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
  getUserById,
  exportUserData,
  unadoptTree,
  createUserProfile,
  updateUserProfile,
} from "../db/db-manager";
import { errorHandler } from "../error-handler";

export async function handleVerifiedRequest(
  tokenSubject: string,
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
            result = await getTreesWateredByUser(uuid);
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
              throw new Error("uuid needs to be defined");
            }
            result = await getAdoptedTreeIdsByUserId(uuid);
            break;
          }
          case "user-profile": {
            if (uuid === undefined) {
              statusCode = 400;
              throw new Error("uuid needs to be defined");
            }
            if (tokenSubject !== uuid) {
              statusCode = 400;
              throw new Error(
                "You're only allowed to query your own user profile",
              );
            }
            result = await getUserById(uuid);
            break;
          }
          case "canexportusers": {
            if (tokenSubject === "auth0|5f29bb0c53a5990037970148"/*joerg*/ 
                || tokenSubject === "auth0|5f3bc85b4ee503006d6c041b"/*thorsten*/) {
              result = true;    
            } else {
              result = false;
            }
            break;
          }
          case "user-export": {
            if (tokenSubject !== "auth0|5f29bb0c53a5990037970148"/*joerg*/ 
                && tokenSubject !== "auth0|5f3bc85b4ee503006d6c041b"/*thorsten*/) {
              statusCode = 400;
              throw new Error(
                "You're not allowed to export the user data",
              );
            }
            result = await exportUserData();
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
        let result: any;
        statusCode = 201;

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
          patches,
          email,
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

          case "user":
            if (
              uuid === undefined ||
              username === undefined ||
              email === undefined
            ) {
              statusCode = 400;
              throw new Error(
                "POST body needs uuid (string) and email (string) properties",
              );
            }

            if (tokenSubject !== uuid) {
              statusCode = 400;
              throw new Error(
                "You're only allowed to create your own user profile",
              );
            }

            result = await createUserProfile({ uuid, username, email, patches: patches || [] });
            break;

          case "user-profile":
            if (
              uuid === undefined ||
              patches === undefined
            ) {
              statusCode = 400;
              throw new Error(
                "POST body needs uuid (string) and a non empty patches (array) properties",
              );
            }

            if (tokenSubject !== uuid) {
              statusCode = 400;
              throw new Error(
                "You're only allowed to update your own user profile",
              );
            }

            statusCode = 200;
            result = await updateUserProfile({ uuid, patches });
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
        const { queryType, tree_id, uuid } = request.body as RequestBody;

        switch (queryType) {
          case "unadopt":
            if (tree_id === undefined || uuid === undefined) {
              statusCode = 400;
              throw new Error("DELETE body uuid and tree_id string properties");
            }
            result = await unadoptTree(tree_id, uuid);
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
            message: `no response defined for method ${request.method}`,
          }),
        );
      }
    }
  } catch (error) {
    await errorHandler({ response, error, statusCode }).catch((err) => err);
    return;
  }
}
