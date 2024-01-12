import { EventType } from "../strategy/type";
import { SupplyUniswapEvent, SupplyUniswapStrategy } from "./type";
import { DataSource } from "typeorm";
import { SupplyUniswapEventModel } from "./model-event";
import { ISupplyUniswapStorage } from "./interface";
import { SupplyUniswapStrategyModel } from "./model-strategy";
import { Network } from "synchronizer";

export const ERROR_MSG_DB_INITIALIZED = "db are initalized";
export const ERROR_MSG_DB_NOT_INITIALIZED = "db are not initalized";

export class Storage implements ISupplyUniswapStorage {
  private ready: boolean;
  private dataSource: DataSource;

  constructor(url: string) {
    this.ready = false;

    this.dataSource = new DataSource({
      type: "postgres",
      url,
      synchronize: true,
      entities: [SupplyUniswapStrategyModel, SupplyUniswapEventModel],
    });
  }

  public async init(): Promise<void> {
    if (this.ready) {
      throw new Error(ERROR_MSG_DB_INITIALIZED);
    }

    await this.dataSource.initialize();
    this.ready = true;
  }

  public async close(): Promise<void> {
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    await this.dataSource.destroy();
  }

  public async insertEvents(tt: SupplyUniswapEvent[]): Promise<SupplyUniswapEvent[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    const events = tt.map((t) => {
      const event = new SupplyUniswapEventModel();
      event.from(t);

      return event;
    });

    // insert bulk in database
    const saved = await this.dataSource.manager.insert(SupplyUniswapEventModel, events);
    if (events.length != saved.identifiers.length) {
      console.warn("the length of the pre and post events do not match");
    }

    // parse and add db id from EventModel to Event
    const parsed = events.map((t, index) => {
      const event = t.to();
      event.id = Number(saved.identifiers[index]);
      return event;
    });

    return parsed;
  }

  public async listEvents(strategyId: number, wallet: string, type: EventType): Promise<SupplyUniswapEvent[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // find inside database deposit events by wallet and contract addres
    const savedEvents = await this.dataSource.manager.find(SupplyUniswapEventModel, {
      where: {
        strategyId,
        wallet,
        type,
      },
    });

    // parse from EventModel to Event
    const events = savedEvents.map((t) => t.to());

    return events;
  }

  public async listEventsByHashes(strategyId: number, hashes: string[]): Promise<SupplyUniswapEvent[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // get and parse events from db
    const events = await this.dataSource.manager.find(SupplyUniswapEventModel, {
      where: hashes.map((h) => ({ strategyId, hash: h })),
    });

    const parsed = events.map((t) => t.to());

    return parsed;
  }

  public async getLastEventByType(strategyId: number, type: EventType): Promise<SupplyUniswapEvent> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // get latest event from db by event type
    const last = await this.dataSource.manager.findOne(SupplyUniswapEventModel, {
      where: {
        type,
        strategyId,
      },
      order: {
        createdAt: "DESC",
      },
    });

    // check if exists a event response and parse
    if (!last) {
      return {
        block: -1,
      } as SupplyUniswapEvent;
    }
    const parse = last.to();

    return parse;
  }

  public async createStrategy(s: SupplyUniswapStrategy): Promise<SupplyUniswapStrategy> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // create using model
    const strategy = new SupplyUniswapStrategyModel();
    strategy.from(s);

    // save in database
    const saved = await this.dataSource.manager.save(SupplyUniswapStrategyModel, strategy);

    return saved.to();
  }

  public async listStrategies(network?: Network): Promise<SupplyUniswapStrategy[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // define find options if network param is defined
    const params = network
      ? {
          where: {
            network,
          },
        }
      : undefined;

    // get and parse events from db
    const strategies = await this.dataSource.manager.find(SupplyUniswapStrategyModel, params);
    const parsed = strategies.map((s) => s.to());

    return parsed;
  }

  public async getStrategy(s: SupplyUniswapStrategy): Promise<SupplyUniswapStrategy | undefined> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // get strategy
    const find = await this.dataSource.manager.findOne(SupplyUniswapStrategyModel, {
      where: {
        contract: s.contract,
        token0Addr: s.data.token0.address,
        token1Addr: s.data.token1.address,
        poolId: s.data.poolId,
      },
    });

    // check finded strategy
    if (!find) {
      return undefined;
    }

    return find.to();
  }
}
