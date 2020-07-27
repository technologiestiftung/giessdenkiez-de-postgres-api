import { NowRequest, NowResponse } from "@vercel/node";

import { verifyRequest } from "./_utils/auth/verify-request";
import { errorHandler } from "./_utils/error-handler";

export default async function (
  request: NowRequest,
  response: NowResponse,
): Promise<void> {
  try {
    await verifyRequest(request, response);
  } catch (error) {
    await errorHandler({ response, error, statusCode: 500 }).catch(
      (err) => err,
    );
    return;
  }
}
