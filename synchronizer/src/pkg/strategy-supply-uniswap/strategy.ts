import { AddressAndNetwork, Network } from "../../synchronizer";
import { EventType } from "../strategy/type";
import { SupplyUniswapEvent, SupplyUniswapStrategy } from "./type";
import { ISupplyUniswapStrategy } from "./interface";
import { ISupplyUniswapStorage } from "./interface";
import { Contract } from "ethers";
import { Cron } from "./cron";
import { DataFeed } from "../data-feed";
import { copyFile } from "fs";

export class Strategy implements ISupplyUniswapStrategy {
  private _strategy: SupplyUniswapStrategy;
  private _storage: ISupplyUniswapStorage;
  private _cron: Cron;

  private _token0DataFeed: DataFeed;
  private _token1DataFeed: DataFeed;

  constructor(strategy: SupplyUniswapStrategy, storage: ISupplyUniswapStorage, intervalMs: number, contract: Contract) {
    this._strategy = strategy;
    this._storage = storage;
    this._cron = new Cron(strategy, intervalMs, contract, this._storage);

    this._token0DataFeed = new DataFeed(
      contract.provider,
      strategy.data.token0.address,
      strategy.data.token0.dataFeedAddr,
      Number(strategy.data.token0.dataFeedFactor)
    );

    this._token1DataFeed = new DataFeed(
      contract.provider,
      strategy.data.token1.address,
      strategy.data.token1.dataFeedAddr,
      Number(strategy.data.token1.dataFeedFactor)
    );
  }

  public get strategy(): SupplyUniswapStrategy {
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

  public async insertEvents(tt: SupplyUniswapEvent[]): Promise<SupplyUniswapEvent[]> {
    return this._storage.insertEvents(tt);
  }

  public async listEvents(wallet: string, type: EventType): Promise<SupplyUniswapEvent[]> {
    return this._storage.listEvents(this._strategy.id!, wallet, type);
  }

  public async listEventsByHashes(hashes: string[]): Promise<SupplyUniswapEvent[]> {
    return this._storage.listEventsByHashes(this._strategy.id!, hashes);
  }

  public async getLastEventByType(type: EventType): Promise<SupplyUniswapEvent> {
    return this._storage.getLastEventByType(this._strategy.id!, type);
  }

  public async getTokensAddresses(): Promise<AddressAndNetwork[]> {
    const strategies = await this._storage.listStrategies(this._strategy.network);

    return strategies.reduce((addrs, s) => {
      const {
        token0: { address: token0Address },
        token1: { address: token1Address },
      } = s.data;

      return [
        ...addrs,
        {
          address: token0Address,
          network: this._strategy.network,
        },
        {
          address: token1Address,
          network: this._strategy.network,
        },
      ];
    }, [] as AddressAndNetwork[]);
  }

  public async listEventsUSD(wallet: string, type: EventType): Promise<SupplyUniswapEvent[]> {
    const events = await this._storage.listEvents(this._strategy.id!, wallet, type);

    const price0 = await this._token0DataFeed.getPrice();
    const price1 = await this._token1DataFeed.getPrice();

    return events.map((event) => {
      const copy = { ...event };

      const unitToken0 = Number(copy.data.token0.amount) / 10 ** 18;
      copy.data.token0.amount = (price0 * unitToken0).toString();

      const unitToken1 = Number(copy.data.token1.amount) / 10 ** 18;
      copy.data.token1.amount = (price1 * unitToken1).toString();

      return copy;
    });
  }
}
