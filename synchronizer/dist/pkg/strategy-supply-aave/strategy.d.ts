import { EventType } from "../strategy/type";
import { AddressAndNetwork, Network } from "../../synchronizer";
import { SupplyAaveEvent, SupplyAaveStrategy } from "./type";
import { Contract } from "ethers";
import { ISupplyAaveStrategy, ISupplyAaveStorage } from "./interface";
export declare class Strategy implements ISupplyAaveStrategy {
    private _strategy;
    private _storage;
    private _cron;
    private _tokenDataFeed;
    constructor(strategy: SupplyAaveStrategy, storage: ISupplyAaveStorage, intervalMs: number, contract: Contract);
    getTokensAddresses(): Promise<AddressAndNetwork[]>;
    get strategy(): SupplyAaveStrategy;
    get network(): Network;
    get contract(): string;
    init(): Promise<void>;
    close(): Promise<void>;
    insertEvents(tt: SupplyAaveEvent[]): Promise<SupplyAaveEvent[]>;
    listEvents(wallet: string, type: EventType): Promise<SupplyAaveEvent[]>;
    listEventsByHashes(hashes: string[]): Promise<SupplyAaveEvent[]>;
    getLastEventByType(type: EventType): Promise<SupplyAaveEvent>;
    getPrice(): Promise<number>;
    listEventsUSD(wallet: string, type: EventType): Promise<SupplyAaveEvent[]>;
}
