import { ISupplyAaveStrategy } from "../strategy-supply-aave/interface";
import { ISupplyUniswapStrategy } from "../strategy-supply-uniswap/interface";
import { Network, TokenSymbol } from "../../synchronizer";
export declare enum EventType {
    Deposit = "deposit",
    Withdraw = "withdraw"
}
export declare type StrategyType = "supply-aave" | "supply-uniswap";
export declare type Context = {
    strategies: {
        supplyUniswap: ISupplyUniswapStrategy[];
        supplyAave: ISupplyAaveStrategy[];
    };
};
export declare type Response = {
    data?: unknown;
    meta?: unknown;
    error?: string;
};
export declare type Strategy = {
    id?: number;
    name: string;
    type: StrategyType;
    network: Network;
    contract: string;
    data: unknown;
};
export declare type Event = {
    id?: number;
    strategyId: number;
    hash: string;
    block: number;
    type: EventType;
    wallet: string;
    createdAt?: number;
    data: unknown;
};
export declare type StrategiesResponse = Response & {
    data?: {
        strategies: any[];
    };
};
export declare type StrategiesByNetworkResponse = Response & {
    data?: {
        strategies: {
            [key: string]: any[];
        };
    };
};
export declare type StrategiesBalancesResponse = Response & {
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
