import { EventType } from "../strategy/type";
import { SupplyUniswapEvent, SupplyUniswapStrategy } from "./type";
import { ISupplyUniswapStorage } from "./interface";
import { Network } from "synchronizer";
export declare const ERROR_MSG_DB_INITIALIZED = "db are initalized";
export declare const ERROR_MSG_DB_NOT_INITIALIZED = "db are not initalized";
export declare class Storage implements ISupplyUniswapStorage {
    private ready;
    private dataSource;
    constructor(url: string);
    init(): Promise<void>;
    close(): Promise<void>;
    insertEvents(tt: SupplyUniswapEvent[]): Promise<SupplyUniswapEvent[]>;
    listEvents(strategyId: number, wallet: string, type: EventType): Promise<SupplyUniswapEvent[]>;
    listEventsByHashes(strategyId: number, hashes: string[]): Promise<SupplyUniswapEvent[]>;
    getLastEventByType(strategyId: number, type: EventType): Promise<SupplyUniswapEvent>;
    createStrategy(s: SupplyUniswapStrategy): Promise<SupplyUniswapStrategy>;
    listStrategies(network?: Network): Promise<SupplyUniswapStrategy[]>;
    getStrategy(s: SupplyUniswapStrategy): Promise<SupplyUniswapStrategy | undefined>;
}
