import { ISupplyAaveStrategy } from "../strategy-supply-aave/interface";
import { SupplyAaveStrategy } from "../strategy-supply-aave/type";
import { ISupplyUniswapStrategy } from "../strategy-supply-uniswap/interface";
import { SupplyUniswapStrategy } from "../strategy-supply-uniswap/type";
import { Network, TokenSymbol } from "../../synchronizer";

export enum EventType {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

export type StrategyType = "supply-aave" | "supply-uniswap";

export type Context = {
  strategies: {
    supplyUniswap: ISupplyUniswapStrategy[];
    supplyAave: ISupplyAaveStrategy[];
  };
};

export type Response = {
  data?: unknown;
  meta?: unknown;
  error?: string;
};

export type Strategy = {
  id?: number;
  name: string;
  type: StrategyType;
  network: Network;
  contract: string;
  data: unknown;
};

export type Event = {
  id?: number;
  strategyId: number;
  hash: string;
  block: number;
  type: EventType;
  wallet: string;
  createdAt?: number;
  data: unknown;
};

export type StrategiesResponse = Response & {
  data?: {
    strategies: any[];
  };
};

export type StrategiesByNetworkResponse = Response & {
  data?: {
    strategies: {
      [key: string]: any[];
    };
  };
};

export type StrategiesBalancesResponse = Response & {
  data?: {
    deposits: string;
    withdraws: string;
    balance: string;
  };
};

export interface IStrategyStorage {
  connect(): Promise<void>;
  close(): Promise<void>;
  listStrategies(): any[];
  tokensByStrategyId(strategyId: string): TokenSymbol[];
  listTokens(): TokenSymbol[];
}
