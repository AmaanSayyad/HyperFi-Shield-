import { Network, Wallet } from "../../synchronizer";
export declare const ERROR_MSG_NOT_INITIALIZED = "db are not initalized";
export declare type Response = {
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
export declare type Context = {
    wm: IWalletManager;
};
export declare type ListWalletsResponse = Response & {
    meta?: {
        count: number;
    };
};
export declare type LoginWalletResponse = Response & {
    data?: {
        address: string;
        ens: string;
    };
};
