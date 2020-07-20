import { types } from "pg";

export interface Generic {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
