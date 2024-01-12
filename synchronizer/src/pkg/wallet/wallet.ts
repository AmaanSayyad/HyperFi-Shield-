import { Network, Wallet } from "../../synchronizer";
import { WalletModel } from "./model";
import { ERROR_MSG_NOT_INITIALIZED, IWalletManager } from "./type";
import { DataSource } from "typeorm";

export class Manager implements IWalletManager {
  private dataSource: DataSource;
  public ready: boolean;

  constructor(url: string) {
    this.ready = false;
    this.dataSource = new DataSource({
      type: "postgres",
      url,
      synchronize: true,
      entities: [WalletModel],
    });
  }

  public async init(): Promise<void> {
    await this.dataSource.initialize();
    this.ready = true;
  }

  public async close(): Promise<void> {
    if (!this.ready) {
      throw new Error(ERROR_MSG_NOT_INITIALIZED);
    }

    await this.dataSource.destroy();
  }

  public async listWallets(network: Network): Promise<string[]> {
    if (!this.ready) {
      throw new Error(ERROR_MSG_NOT_INITIALIZED);
    }

    // find inside database all wallets
    // TODO(ca): implement COUNT using SQL builder
    // TODO(ca): should return count for diferent networks
    const wallets = await this.dataSource.manager.find(WalletModel, {
      where: {
        // network,
      },
    });
    const walletsAddrs = [...new Set(wallets.map((w) => w.address))];

    return walletsAddrs;
  }

  public async login(network: Network, address: string): Promise<Wallet> {
    // check if class are correctly initialized
    if (!this.ready) {
      throw new Error(ERROR_MSG_NOT_INITIALIZED);
    }

    // prepare wallet db model
    const wallet = new WalletModel();
    wallet.network = network;
    wallet.address = address;

    // insert wallet into the db
    const saved = await this.dataSource.manager.save(WalletModel, wallet);
    const parsed = saved.to();

    return parsed;
  }
}
