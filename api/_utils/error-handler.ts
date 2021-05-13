import { setupResponseData } from "./setup-response";
import { send } from "micro";
import { VercelResponse } from "@vercel/node";

export async function errorHandler(opts: {
  response: VercelResponse;
  error: Error;
  statusCode: number;
}): Promise<void> {
  const { error, statusCode, response } = opts;
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
