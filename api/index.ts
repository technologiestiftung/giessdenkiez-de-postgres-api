import { send } from "micro";
import { NowRequest, NowResponse } from "@vercel/node";
import { getPackage } from "./_utils/package";

const pkg = getPackage();

export default async function (
  _request: NowRequest,
  response: NowResponse,
): Promise<void> {
  try {
    // const data = await json(request);
    send(response, 200, {
      version: pkg.version,
      name: pkg.name,
      bugs: pkg.bugs?.url,
      home: pkg.homepage,
    });
    return;
  } catch (error) {
    console.log(error);
    send(response, 400);
    return;
  }
}
