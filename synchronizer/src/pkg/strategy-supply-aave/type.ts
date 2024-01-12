import { TokenSymbol } from "../../synchronizer";
import { Event } from "../strategy/type";
import { ISupplyAaveStorage, ISupplyAaveStrategy } from "./interface";
import { Strategy } from "../strategy/type";

export const ERROR_MSG_NOT_INITIALIZED = "cron has not correctly initialized";

export interface CronEvent {
  block: number;
}

export type SupplyAaveStrategy = Strategy & {
  data: {
    token: {
      symbol: TokenSymbol;
      address: string;
      dataFeedAddr: string;
      dataFeedFactor: string;
    };
  };
};

export type SupplyAaveEvent = Event & {
  data: {
    token: {
      amount: string;
    };
  };
};

export type Response = {
  data?: unknown;
  meta?: unknown;
  error?: string;
};

export type Context = {
  strategies: ISupplyAaveStrategy[];
  storage: ISupplyAaveStorage;
};

export type DepositsResponse = Response & {
  data?: {
    deposits: SupplyAaveEvent[];
  };
  meta?: {
    count: number;
  };
};

export type WithdrawsResponse = Response & {
  data?: {
    withdraws: Event[];
  };
  meta?: {
    count: number;
  };
};

export type BalacesResponse = Response & {
  data?: {
    deposits: string;
    withdraws: string;
    balance: string;
  };
};
