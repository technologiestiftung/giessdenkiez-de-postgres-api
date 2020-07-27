import { Generic } from "../_utils/common/interfaces";
import { NowRequest, NowResponse } from "@vercel/node";

export function setupRequest(overrides?: Generic): NowRequest {
  const req = {
    query: {},
    method: "GET",
    ...overrides,
  };
  return req as NowRequest;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupResponse(overrides?: Generic): NowResponse {
  const res = {
    setHeader: jest.fn(),
    query: {},
    ...overrides,
  };
  return (res as unknown) as NowResponse;
}
