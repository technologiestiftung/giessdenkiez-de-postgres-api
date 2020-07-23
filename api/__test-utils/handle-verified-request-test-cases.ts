import {
  VerifiedReqCaseOptionPOST,
  VerifiedReqCaseOptionGET,
  VerifiedReqCaseOption,
} from "../_utils/common/interfaces";

function setupNames(
  collection: VerifiedReqCaseOptionPOST[],
): VerifiedReqCaseOptionPOST[] {
  for (const item of collection) {
    item.name = ` ${item.method} request, with queryType "${
      item.queryType
    }", with body:"${JSON.stringify(item.body)}" and answer with ${
      item.statusCode
    }`;
  }
  return collection;
}

function setupNamesGET(
  collection: VerifiedReqCaseOptionGET[],
): VerifiedReqCaseOptionGET[] {
  for (const item of collection) {
    item.name = ` ${item.queryType} with query:"${JSON.stringify(
      item.query,
    )}" and answer with ${item.statusCode}`;
  }
  return collection;
}

export const caseCollectionGET: VerifiedReqCaseOptionGET[] = setupNamesGET([
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "watered",
    query: {},
    data: undefined,
    statusCode: 200,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "istreeadopted",
    query: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "istreeadopted",
    query: { id: "_abc" },
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "istreeadopted",
    query: { uuid: "auth0|123" },
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "istreeadopted",
    query: { id: "_abc", uuid: "auth0|123" },
    data: undefined,
    statusCode: 200,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "lastwatered",
    query: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "lastwatered",
    query: { id: "_abc" },
    data: undefined,
    statusCode: 200,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "wateredbyuser",
    query: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "wateredbyuser",
    query: { uuid: "auth0|123" },
    data: undefined,
    statusCode: 200,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "adopted",
    query: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "GET",
    queryType: "adopted",
    query: { uuid: "auth0|123" },
    data: undefined,
    statusCode: 200,
  },
]);

export const caseCollectionPATCH: VerifiedReqCaseOption[] = [
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "PATCH",
    queryType: "unknown",
    // body: {},
    data: {},
    statusCode: 400,
  },
];

export const caseCollectionDELETE: VerifiedReqCaseOptionPOST[] = setupNames([
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: "unknown",
    body: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: undefined,
    body: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: "unadopt",
    body: undefined,
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: "unadopt",
    body: {},
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: "unadopt",
    body: { tree_id: "_abc" },
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: "unadopt",
    body: { uuid: "auth0|123" },
    data: {},
    statusCode: 400,
  },
  {
    name: 'queryType with "query" and answer with statusCode',
    method: "DELETE",
    queryType: "unadopt",
    body: { tree_id: "_abc", uuid: "auth0|123" },
    data: undefined,
    statusCode: 200,
  },
]);

export const caseCollectionPOST: VerifiedReqCaseOptionPOST[] = setupNames([
  ...caseCollectionDELETE,

  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "foo",
    body: {},
    statusCode: 400,
    data: {},
    method: "POST",
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: undefined,
    body: undefined,
    statusCode: 400,
    data: {},
    method: "POST",
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: undefined,
    statusCode: 400,
    data: {},
    method: "POST",
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: {},
    statusCode: 400,
    data: {},
    method: "POST",
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: { uuid: "auth0|123" },
    statusCode: 400,
    data: {},
    method: "POST",
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: { tree_id: "_abc" },
    statusCode: 400,
    data: {},
    method: "POST",
  },
  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "adopt",
    body: { uuid: "auth0|123", tree_id: "_abc" },
    statusCode: 201,
    data: undefined,
    method: "POST",
  },

  {
    name: 'queryType with "body" and answer with statusCode',
    queryType: "water",
    body: {},
    statusCode: 400,
    data: {},
    method: "POST",
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
    method: "POST",
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
    method: "POST",
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
    method: "POST",
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
    method: "POST",
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
    method: "POST",
  },
]);

///////////////////////////// eslint-disable-next-line

// eslint-disable-next-line jest/no-commented-out-tests
// test.each([
//   ["adopt", {}, 400, {}],
//   ["adopt", { uuid: "auth0|123" }, 400, {}],
//   ["adopt", { tree_id: "_abc" }, 400, {}],
//   ["adopt", { uuid: "auth0|123", tree_id: "_abc" }, 201, undefined],

//   ["water", { query: {} }, 400, {}],
//   [
//     "water",
//     {
//       tree_id: "_abc",
//       amount: 100,
//       uuid: "auth0|123",
//     },
//     400,
//     {},
//   ],
//   [
//     "water",
//     {
//       username: "foo",
//       amount: 100,
//       uuid: "auth0|123",
//     },
//     400,
//     {},
//   ],
//   [
//     "water",
//     {
//       username: "foo",
//       tree_id: "_abc",
//       uuid: "auth0|123",
//     },
//     400,
//     {},
//   ],
//   [
//     "water",
//     {
//       username: "foo",
//       tree_id: "_abc",
//       amount: 100,
//     },
//     400,
//     {},
//   ],
//   [
//     "water",
//     {
//       username: "foo",
//       tree_id: "_abc",
//       amount: 100,
//       uuid: "auth0|123",
//     },
//     201,
//     undefined,
//   ],
// ])(
//   "should make POST request to %s with body %j and answer with %i",
//   async (queryType, body, statusCode, data) => {
//     switch (queryType) {
//       case "adopt":
//         jest
//           .spyOn(manager, "adoptTree")
//           .mockImplementation(() => Promise.resolve("adopted"));
//         break;
//       case "water":
//         jest
//           .spyOn(manager, "waterTree")
//           .mockImplementation(() => Promise.resolve("watered"));
//         break;
//     }
//     const req = setupRequest({
//       body: { ...body, queryType },
//       method: "POST",
//     });
//     const res = setupResponse();
//     await handleVerifiedRequest(req, res);
//     expect(micro.send).toHaveBeenCalledWith(res, statusCode, data);
//     switch (queryType) {
//       case "water":
//         if (statusCode === 201) {
//           expect(manager.waterTree).toHaveBeenCalledWith({
//             tree_id: req.body.tree_id,
//             uuid: req.body.uuid,
//             amount: req.body.amount,
//             username: req.body.username,
//           });
//         } else {
//           expect(manager.waterTree).not.toHaveBeenCalled();
//         }
//         break;
//       case "adopt":
//         if (statusCode === 201) {
//           expect(manager.adoptTree).toHaveBeenCalledWith(
//             req.body.tree_id,
//             req.body.uuid,
//           );
//         } else {
//           expect(manager.adoptTree).not.toHaveBeenCalled();
//         }
//         break;
//     }
//   },
// ),
// );
