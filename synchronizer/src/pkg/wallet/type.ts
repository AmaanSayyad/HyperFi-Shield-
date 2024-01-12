import { Network, Wallet } from "../../synchronizer";

export const ERROR_MSG_NOT_INITIALIZED = "db are not initalized";

export type Response = {
  data?: unknown;
  meta?: unknown;
  error?: string;
};

export interface IWalletManager {
  init(): Promise<void>;
  close(): Promise<void>;
  listWallets(network: Network): Promise<string[]>;
  login(network: Network, wallet: string): Promise<Wallet>;
}

export type Context = {
  wm: IWalletManager;
};

export type ListWalletsResponse = Response & {
  meta?: {
    count: number;
  };
};

export type LoginWalletResponse = Response & {
  data?: {
    address: string;
    ens: string;
  };
};
