import { VercelRequest, VercelResponse } from "@vercel/node";

import { verifyRequest } from "./_utils/auth/verify-request";
import { errorHandler } from "./_utils/error-handler";

export default async function (
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  try {
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Authorization, Accept, Content-Type",
    );
    await verifyRequest(request, response);
  } catch (error) {
    await errorHandler({ response, error, statusCode: 500 }).catch(
      (err) => err,
    );
    return;
  }
}
