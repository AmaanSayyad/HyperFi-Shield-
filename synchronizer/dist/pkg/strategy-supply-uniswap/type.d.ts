import { Event, Strategy } from "../strategy/type";
import { TokenSymbol } from "../../synchronizer";
import { ISupplyUniswapStorage, ISupplyUniswapStrategy } from "./interface";
export declare const ERROR_MSG_NOT_INITIALIZED = "db are not initalized";
export interface CronEvent {
    block: number;
}
export declare type SupplyUniswapStrategy = Strategy & {
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
export declare type SupplyUniswapEvent = Event & {
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
export declare type Response = {
    data?: unknown;
    meta?: unknown;
    error?: string;
};
export declare type Context = {
    strategies: ISupplyUniswapStrategy[];
    storage: ISupplyUniswapStorage;
};
export declare type DepositsResponse = Response & {
    data?: {
        deposits: SupplyUniswapEvent[];
    };
    meta?: {
        count: number;
    };
};
export declare type WithdrawsResponse = Response & {
    data?: {
        withdraws: Event[];
    };
    meta?: {
        count: number;
    };
};
declare type Balance = {
    deposits: string;
    withdraws: string;
    balance: string;
};
export declare type BalacesResponse = Response & {
    data?: {
        token0: Balance;
        token1: Balance;
    };
};
export {};
