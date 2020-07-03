import { send } from "micro";
import { NowRequest, NowResponse } from "@vercel/node";
import { setupResponseData } from "./_utils/setup-response";
export default async function (
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  try {
    const data = setupResponseData({ url: request.url, data: [] });
    return send(response, 200, data);
  } catch (error) {
    return send(
      response,
      400,
      setupResponseData({
        error:
          process.env.NODE_ENV === "development"
            ? JSON.stringify(error)
            : undefined,
      }),
    );
  }
}
