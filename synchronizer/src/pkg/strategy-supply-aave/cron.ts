import { Contract } from "ethers";
import { CronEvent, SupplyAaveEvent, SupplyAaveStrategy } from "./type";
import { EventType } from "../strategy/type";
import { toEvent } from "./util";
import { ISupplyAaveStorage } from "./interface";

export const ERROR_MSG_CRON_INITIALIZED = "cron are initalized";
export const ERROR_MSG_CRON_NOT_INITIALIZED = "cron are not initalized";

export class Cron {
  private _strategy: SupplyAaveStrategy;
  private latestDeposit: CronEvent;
  private latestWithdraw: CronEvent;
  private intervalMs: number;
  private contract: Contract;
  private interval: NodeJS.Timer;
  private ready: boolean;
  private storage: ISupplyAaveStorage;

  constructor(strategy: SupplyAaveStrategy, intervalMs: number, contract: Contract, storage: ISupplyAaveStorage) {
    this._strategy = strategy;
    this.intervalMs = intervalMs;
    this.contract = contract;
    this.storage = storage;
    this.ready = false;
  }

  public async close(): Promise<void> {
    if (!this.ready) {
      throw new Error(ERROR_MSG_CRON_NOT_INITIALIZED);
    }

    clearInterval(this.interval);
  }

  public async init(latestDeposit: CronEvent, latestWithdraw: CronEvent): Promise<void> {
    if (this.ready) {
      throw new Error(ERROR_MSG_CRON_INITIALIZED);
    }

    this.latestDeposit = latestDeposit;
    this.latestWithdraw = latestWithdraw;

    this.interval = setInterval(async () => {
      // get and insert new deposits from contract events into the db and then replace block number
      try {
        const deposits = await this.getNewEvents(EventType.Deposit, this.latestDeposit.block);
        if (deposits.length > 0) {
          console.log("Supply Aave: Inserting deposits in db", deposits);
          await this.storage.insertEvents(deposits);
          this.latestDeposit.block = deposits[deposits.length - 1].block;
        }
      } catch (err: any) {
        console.warn(`Supply Aave: Could't get or insert deposit event, err=${err.message}`);
      }

      // get and insert new withdraws from contracts events into the db and then replace block number
      try {
        const withdraws = await this.getNewEvents(EventType.Withdraw, this.latestWithdraw.block);
        if (withdraws.length > 0) {
          console.log("Supply Aave:: Inserting withdraw in db", withdraws);
          await this.storage.insertEvents(withdraws);
          this.latestWithdraw.block = withdraws[withdraws.length - 1].block;
        }
      } catch (err: any) {
        console.warn(`Supply Aave: Could't get or insert withdraw event, err=${err.message}`);
      }
    }, this.intervalMs);
  }

  private async getNewEvents(type: EventType, latestBlock: number): Promise<SupplyAaveEvent[]> {
    // prepare and get query to blockchan for getting the events
    const filterFrom = type === EventType.Deposit ? this.contract.filters.Deposit() : this.contract.filters.Withdraw();
    const fromBlockNumber = latestBlock > 0 ? latestBlock : undefined;
    const events = await this.contract.queryFilter(filterFrom, fromBlockNumber);
    if (!events.length) {
      return [];
    }

    // TODO(ca): research how get datetime using "block_number"

    // sort and find fetched events hashes inside the database
    const sortedEvents = events.sort((a, b) => a.blockNumber - b.blockNumber);
    const hashes = sortedEvents.map((e) => e.transactionHash);
    const dbHashes = (await this.storage.listEventsByHashes(this._strategy.id!, hashes)).map((t) => t.hash);

    // filter, parse and prepare events to bulk insert in database
    const filtered = sortedEvents.filter((t) => !dbHashes.includes(t.transactionHash));
    if (filtered.length === 0) {
      return [];
    }
    const parsed = filtered.map((e) => toEvent(this._strategy.id!, e, type));

    return parsed;
  }
}
EventType;
