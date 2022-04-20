import { BodyQueryType, RequestMethod } from "./types";

export interface Generic {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface RequestBody {
  watering_id?: number;
  queryType: BodyQueryType;
  time?: string;
  tree_id?: string;
  uuid?: string;
  username?: string;
  amount?: number;
}

export interface Tree {
  id: string;
  lat: string;
  lng: string;
  artdtsch: string;
  artBot: string;
  gattungdeutsch: string;
  gattung: string;
  strname: string;
  hausnr: string;
  zusatz: string;
  pflanzjahr: string;
  standalter: string;
  kronedurch: string;
  stammumfg: string;
  type: string;
  baumhoehe: string;
  bezirk: string;
  eigentuemer: string;
  adopted: unknown;
  watered: unknown;
  radolan_sum: number;
  radolan_days: number[];
  geom: string;
}

export type TreeReduced = [string, number, number, number];
export interface AllTreesFiltered {
  watered: TreeReduced[];
}

export interface TreeWatered {
  amount: string;
  tree_id: string;
  time: Date | string;
  uuid: string;
  timestamp: Date | string;
  username: string;
}

export interface TreeAdopted {
  id: string;
  tree_id: string;
  uuid: string;
}
export interface TreeWateredAndAdopted {
  tree_id: string;
  adopted: string;
  watered: string;
}

export interface VerifiedReqCaseOption {
  name: string;
  queryType?: string;
  statusCode: number;
  data?: Generic;
  method: RequestMethod;
}

export interface VerifiedReqCaseOptionPOST extends VerifiedReqCaseOption {
  body?: Generic;
}
export interface VerifiedReqCaseOptionGET extends VerifiedReqCaseOption {
  query: Generic;
}
