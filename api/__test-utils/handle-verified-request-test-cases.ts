import { VerifiedReqCaseOption } from "../_utils/common/interfaces";

function setupNames(
  collection: VerifiedReqCaseOption[],
): VerifiedReqCaseOption[] {
  for (const item of collection) {
    item.name = ` ${item.queryType} with body:"${JSON.stringify(
      item.body,
    )}" and answer with ${item.statusCode}`;
  }
  return collection;
}

export const caseCollection: VerifiedReqCaseOption[] = setupNames([
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: {},
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: { uuid: "auth0|123" },
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: { tree_id: "_abc" },
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: { uuid: "auth0|123", tree_id: "_abc" },
    statusCode: 201,
  },

  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {},
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {
      tree_id: "_abc",
      amount: 100,
      uuid: "auth0|123",
    },
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {
      username: "foo",
      amount: 100,
      uuid: "auth0|123",
    },
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {
      username: "foo",
      tree_id: "_abc",
      uuid: "auth0|123",
    },
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {
      username: "foo",
      tree_id: "_abc",
      amount: 100,
    },
    statusCode: 400,
    data: {},
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {
      username: "foo",
      tree_id: "_abc",
      amount: 100,
      uuid: "auth0|123",
    },
    statusCode: 201,
    data: undefined,
  },
]);
