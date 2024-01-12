import { Contract } from "ethers";
import { CronEvent, SupplyAaveStrategy } from "./type";
import { ISupplyAaveStorage } from "./interface";
export declare const ERROR_MSG_CRON_INITIALIZED = "cron are initalized";
export declare const ERROR_MSG_CRON_NOT_INITIALIZED = "cron are not initalized";
export declare class Cron {
    private _strategy;
    private latestDeposit;
    private latestWithdraw;
    private intervalMs;
    private contract;
    private interval;
    private ready;
    private storage;
    constructor(strategy: SupplyAaveStrategy, intervalMs: number, contract: Contract, storage: ISupplyAaveStorage);
    close(): Promise<void>;
    init(latestDeposit: CronEvent, latestWithdraw: CronEvent): Promise<void>;
    private getNewEvents;
}
