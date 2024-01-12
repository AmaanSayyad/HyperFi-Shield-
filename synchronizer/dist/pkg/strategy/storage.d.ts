import { IStrategyStorage } from "./type";
import { EntitySchema } from "typeorm";
import { TokenSymbol } from "../../synchronizer";
export declare const ERROR_MSG_NOT_INITIALIZED = "db are not initalized";
export declare class Database implements IStrategyStorage {
    private dataSource;
    private ready;
    constructor(url: string, model: EntitySchema<any>);
    connect(): Promise<void>;
    close(): Promise<void>;
    listStrategies(): any[];
    tokensByStrategyId(strategyId: string): TokenSymbol[];
    listTokens(): TokenSymbol[];
}
