import { EventType } from "../strategy/type";
import { SupplyAaveEvent, SupplyAaveStrategy } from "./type";
import { DataSource } from "typeorm";
import { SupplyAaveEventModel } from "./model-event";
import { SupplyAaveStrategyModel } from "./model-strategy";
import { ISupplyAaveStorage } from "./interface";
import { Network } from "synchronizer";

export const ERROR_MSG_DB_INITIALIZED = "db are initalized";
export const ERROR_MSG_DB_NOT_INITIALIZED = "db are not initalized";

export class Storage implements ISupplyAaveStorage {
  private ready: boolean;
  private dataSource: DataSource;

  constructor(url: string) {
    this.ready = false;

    this.dataSource = new DataSource({
      type: "postgres",
      url,
      synchronize: true,
      entities: [SupplyAaveStrategyModel, SupplyAaveEventModel],
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

  public async insertEvents(tt: SupplyAaveEvent[]): Promise<SupplyAaveEvent[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    const events = tt.map((t) => {
      const event = new SupplyAaveEventModel();
      event.from(t);

      return event;
    });

    // insert bulk in database
    const saved = await this.dataSource.manager.insert(SupplyAaveEventModel, events);
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

  public async listEvents(strategyId: number, wallet: string, type: EventType): Promise<SupplyAaveEvent[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // find inside database deposit events by wallet and contract address
    const savedEvents = await this.dataSource.manager.find(SupplyAaveEventModel, {
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

  public async listEventsByHashes(strategyId: number, hashes: string[]): Promise<SupplyAaveEvent[]> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // get and parse events from db
    const events = await this.dataSource.manager.find(SupplyAaveEventModel, {
      where: hashes.map((h) => ({ strategyId, hash: h })),
    });
    const parsed = events.map((t) => t.to());

    return parsed;
  }

  public async getLastEventByType(strategyId: number, type: EventType): Promise<SupplyAaveEvent> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // get latest event from db by event type
    const last = await this.dataSource.manager.findOne(SupplyAaveEventModel, {
      where: {
        strategyId,
        type,
      },
      order: {
        createdAt: "DESC",
      },
    });

    // check if exists a event response and parse
    if (!last) {
      return {
        block: -1,
      } as SupplyAaveEvent;
    }
    const parse = last.to();

    return parse;
  }

  public async createStrategy(s: SupplyAaveStrategy): Promise<SupplyAaveStrategy> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    const strategy = new SupplyAaveStrategyModel();
    strategy.from(s);

    // save in database
    const saved = await this.dataSource.manager.save(SupplyAaveStrategyModel, strategy);

    return saved.to();
  }

  public async listStrategies(network?: Network): Promise<SupplyAaveStrategy[]> {
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
    const strategies = await this.dataSource.manager.find(SupplyAaveStrategyModel, params);
    const parsed = strategies.map((s) => s.to());

    return parsed;
  }

  public async getStrategy(s: SupplyAaveStrategy): Promise<SupplyAaveStrategy | undefined> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_DB_NOT_INITIALIZED);
    }

    // get strategy
    const find = await this.dataSource.manager.findOne(SupplyAaveStrategyModel, {
      where: {
        contract: s.contract,
        address: s.data.token.address,
      },
    });

    // check finded strategy
    if (!find) {
      return undefined;
    }

    return find.to();
  }
}
