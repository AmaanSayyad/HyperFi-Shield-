import { EventType } from "../strategy/type";
import { AddressAndNetwork, Network } from "../../synchronizer";
import { SupplyAaveEvent, SupplyAaveStrategy } from "./type";
import { Contract, ethers } from "ethers";
import { Cron } from "./cron";
import { ISupplyAaveStrategy, ISupplyAaveStorage } from "./interface";
import { DataFeed } from "../data-feed";

export class Strategy implements ISupplyAaveStrategy {
  private _strategy: SupplyAaveStrategy;
  private _storage: ISupplyAaveStorage;
  private _cron: Cron;
  private _tokenDataFeed: DataFeed;

  constructor(strategy: SupplyAaveStrategy, storage: ISupplyAaveStorage, intervalMs: number, contract: Contract) {
    this._strategy = strategy;
    this._storage = storage;
    this._cron = new Cron(strategy, intervalMs, contract, this._storage);

    this._tokenDataFeed = new DataFeed(
      contract.provider,
      strategy.data.token.address,
      strategy.data.token.dataFeedAddr,
      Number(strategy.data.token.dataFeedFactor)
    );
  }

  public async getTokensAddresses(): Promise<AddressAndNetwork[]> {
    const strategies = await this._storage.listStrategies(this._strategy.network);

    return strategies.map((s) => ({
      address: s.data.token.address,
      network: this._strategy.network,
    }));
  }

  public get strategy(): SupplyAaveStrategy {
    return this._strategy;
  }

  get network(): Network {
    return this._strategy.network;
  }

  get contract(): string {
    return this._strategy.contract;
  }

  public async init(): Promise<void> {
    // get latest deposit/withdraw events from db
    const latestDeposit = await this._storage.getLastEventByType(this._strategy.id!, EventType.Deposit);
    const latestWithdraw = await this._storage.getLastEventByType(this._strategy.id!, EventType.Withdraw);

    await this._cron.init(latestDeposit, latestWithdraw);
  }

  public async close(): Promise<void> {
    await this._storage.close();
    await this._cron.close();
  }

  public async insertEvents(tt: SupplyAaveEvent[]): Promise<SupplyAaveEvent[]> {
    return this._storage.insertEvents(tt);
  }

  public async listEvents(wallet: string, type: EventType): Promise<SupplyAaveEvent[]> {
    return this._storage.listEvents(this._strategy.id!, wallet, type);
  }

  public async listEventsByHashes(hashes: string[]): Promise<SupplyAaveEvent[]> {
    return this._storage.listEventsByHashes(this._strategy.id!, hashes);
  }

  public async getLastEventByType(type: EventType): Promise<SupplyAaveEvent> {
    return this._storage.getLastEventByType(this._strategy.id!, type);
  }

  public async getPrice(): Promise<number> {
    const price = await this._tokenDataFeed.getPrice();
    return price;
  }

  public async listEventsUSD(wallet: string, type: EventType): Promise<SupplyAaveEvent[]> {
    const events = await this._storage.listEvents(this._strategy.id!, wallet, type);

    const price = await this._tokenDataFeed.getPrice();
    return events.map((event) => {
      const copy = { ...event };

      const unit = Number(copy.data.token.amount) / 10 ** 18;
      copy.data.token.amount = (price * unit).toString();

      return copy;
    });
  }
}
