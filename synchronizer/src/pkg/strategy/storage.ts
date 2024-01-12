import { IStrategyStorage } from "./type";
import { DataSource, EntitySchema } from "typeorm";
import { TokenSymbol } from "../../synchronizer";

export const ERROR_MSG_NOT_INITIALIZED = "db are not initalized";

export class Database implements IStrategyStorage {
  private dataSource: DataSource;
  private ready: boolean;

  constructor(url: string, model: EntitySchema<any>) {
    this.ready = false;
    this.dataSource = new DataSource({
      type: "postgres",
      url,
      synchronize: true,
      entities: [model],
    });
  }

  public async connect(): Promise<void> {
    await this.dataSource.initialize();
    this.ready = true;
  }

  public async close(): Promise<void> {
    if (!this.ready) {
      throw new Error(ERROR_MSG_NOT_INITIALIZED);
    }

    await this.dataSource.destroy();
  }

  public listStrategies(): any[] {
    throw new Error("Method not implemented.");
  }

  public tokensByStrategyId(strategyId: string): TokenSymbol[] {
    throw new Error("Method not implemented.");
  }

  public listTokens(): TokenSymbol[] {
    throw new Error("Method not implemented.");
  }

  // public createStrategy(s: Strategy): Strategy {
  //   throw new Error("Method not implemented.");
  // }

  // public updateStrategy(id: number, s: Strategy): Strategy {
  //   throw new Error("Method not implemented.");
  // }
}
