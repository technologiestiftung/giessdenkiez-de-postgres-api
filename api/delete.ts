import { NowRequest, NowResponse } from "@vercel/node";
import { errorHandler } from "./_utils/error-handler";
import { verifyRequest } from "./_utils/auth/verify-request";

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
  try {
    await verifyRequest(request, response);
  } catch (error) {
    await errorHandler({ response, error, statusCode: 500 }).catch(
      (err) => err,
    );
    return;
  }
}
