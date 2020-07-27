import { send } from "micro";
import { NowRequest, NowResponse } from "@vercel/node";
import { setupResponseData } from "./_utils/setup-response";
import { errorHandler } from "./_utils/error-handler";

export default async function (
  _request: NowRequest,
  response: NowResponse,
): Promise<void> {
  try {
    // const data = await json(request);
    send(
      response,
      200,
      setupResponseData({ message: "Yeah baby. It's working" }),
    );
    return;
  } catch (error) {
    await errorHandler({ response, error, statusCode: 500 }).catch(
      (err) => err,
    );
    return;
  }
}
