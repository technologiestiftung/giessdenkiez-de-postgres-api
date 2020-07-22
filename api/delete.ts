import { send } from "micro";
import { NowRequest, NowResponse } from "@vercel/node";
import { setupResponseData } from "./_utils/setup-response";
import { unadoptTree } from "./_utils/db/db-manager";

type DeleteQueryType = "unadopt";

interface Body {
  queryType: DeleteQueryType;
  tree_id?: string;
  uuid?: string;
}
export default async function (
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  let statusCode = 201;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: string;
  try {
    if (request.method !== "DELETE") {
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
    const { queryType, tree_id, uuid } = request.body as Body;

    switch (queryType) {
      case "unadopt":
        if (tree_id === undefined || uuid === undefined) {
          statusCode = 400;
          throw new Error("POST body uuid and tree_id string properties");
        }
        result = await unadoptTree(tree_id, uuid);
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
