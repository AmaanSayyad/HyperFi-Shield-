import { AddressAndNetwork, Network } from "../../synchronizer";
import { EventType } from "../strategy/type";
import { SupplyUniswapEvent, SupplyUniswapStrategy } from "./type";
import { ISupplyUniswapStrategy } from "./interface";
import { ISupplyUniswapStorage } from "./interface";
import { Contract } from "ethers";
export declare class Strategy implements ISupplyUniswapStrategy {
    private _strategy;
    private _storage;
    private _cron;
    private _token0DataFeed;
    private _token1DataFeed;
    constructor(strategy: SupplyUniswapStrategy, storage: ISupplyUniswapStorage, intervalMs: number, contract: Contract);
    get strategy(): SupplyUniswapStrategy;
    get network(): Network;
    get contract(): string;
    init(): Promise<void>;
    close(): Promise<void>;
    insertEvents(tt: SupplyUniswapEvent[]): Promise<SupplyUniswapEvent[]>;
    listEvents(wallet: string, type: EventType): Promise<SupplyUniswapEvent[]>;
    listEventsByHashes(hashes: string[]): Promise<SupplyUniswapEvent[]>;
    getLastEventByType(type: EventType): Promise<SupplyUniswapEvent>;
    getTokensAddresses(): Promise<AddressAndNetwork[]>;
    listEventsUSD(wallet: string, type: EventType): Promise<SupplyUniswapEvent[]>;
}
