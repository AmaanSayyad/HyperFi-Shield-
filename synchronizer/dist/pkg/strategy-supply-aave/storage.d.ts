import { EventType } from "../strategy/type";
import { SupplyAaveEvent, SupplyAaveStrategy } from "./type";
import { ISupplyAaveStorage } from "./interface";
import { Network } from "synchronizer";
export declare const ERROR_MSG_DB_INITIALIZED = "db are initalized";
export declare const ERROR_MSG_DB_NOT_INITIALIZED = "db are not initalized";
export declare class Storage implements ISupplyAaveStorage {
    private ready;
    private dataSource;
    constructor(url: string);
    init(): Promise<void>;
    close(): Promise<void>;
    insertEvents(tt: SupplyAaveEvent[]): Promise<SupplyAaveEvent[]>;
    listEvents(strategyId: number, wallet: string, type: EventType): Promise<SupplyAaveEvent[]>;
    listEventsByHashes(strategyId: number, hashes: string[]): Promise<SupplyAaveEvent[]>;
    getLastEventByType(strategyId: number, type: EventType): Promise<SupplyAaveEvent>;
    createStrategy(s: SupplyAaveStrategy): Promise<SupplyAaveStrategy>;
    listStrategies(network?: Network): Promise<SupplyAaveStrategy[]>;
    getStrategy(s: SupplyAaveStrategy): Promise<SupplyAaveStrategy | undefined>;
}
