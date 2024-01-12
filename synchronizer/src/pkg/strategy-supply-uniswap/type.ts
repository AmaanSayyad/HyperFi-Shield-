import { Event, Strategy } from "../strategy/type";
import { TokenSymbol } from "../../synchronizer";
import { ISupplyUniswapStorage, ISupplyUniswapStrategy } from "./interface";

export const ERROR_MSG_NOT_INITIALIZED = "db are not initalized";

export interface CronEvent {
  block: number;
}

export type SupplyUniswapStrategy = Strategy & {
  data: {
    poolId: string;
    poolFee: string;
    token0: {
      symbol: TokenSymbol;
      address: string;
      dataFeedAddr: string;
      dataFeedFactor: string;
    };
    token1: {
      symbol: TokenSymbol;
      address: string;
      dataFeedAddr: string;
      dataFeedFactor: string;
    };
  };
};

export type SupplyUniswapEvent = Event & {
  data: {
    poolId: string;
    poolFee: string;
    token0: {
      address: string;
      amount: string;
    };
    token1: {
      address: string;
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
  strategies: ISupplyUniswapStrategy[];
  storage: ISupplyUniswapStorage;
};

export type DepositsResponse = Response & {
  data?: {
    deposits: SupplyUniswapEvent[];
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

type Balance = {
  deposits: string;
  withdraws: string;
  balance: string;
};

export type BalacesResponse = Response & {
  data?: {
    token0: Balance;
    token1: Balance;
  };
};
