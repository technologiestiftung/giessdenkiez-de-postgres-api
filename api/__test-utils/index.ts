import { Generic } from "../_utils/common/interfaces";
import { VercelRequest, VercelResponse } from "@vercel/node";

export function setupRequest(overrides?: Generic): VercelRequest {
  const req = {
    query: {},
    method: "GET",
    ...overrides,
  };
  return req as VercelRequest;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupResponse(overrides?: Generic): VercelResponse {
  const res = {
    setHeader: jest.fn(),
    query: {},
    ...overrides,
  };
  return (res as unknown) as VercelResponse;
}
