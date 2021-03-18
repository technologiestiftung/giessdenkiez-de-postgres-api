import { VercelRequest, VercelResponse } from "@vercel/node";
import { errorHandler } from "./_utils/error-handler";
import { verifyRequest } from "./_utils/auth/verify-request";

type DeleteQueryType = "unadopt";

interface Body {
  queryType: DeleteQueryType;
  tree_id?: string;
  uuid?: string;
}
export default async function (
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  try {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
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
