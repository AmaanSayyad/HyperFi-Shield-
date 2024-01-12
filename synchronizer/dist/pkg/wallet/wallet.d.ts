import { Network, Wallet } from "../../synchronizer";
import { IWalletManager } from "./type";
export declare class Manager implements IWalletManager {
    private dataSource;
    ready: boolean;
    constructor(url: string);
    init(): Promise<void>;
    close(): Promise<void>;
    listWallets(network: Network): Promise<string[]>;
    login(network: Network, address: string): Promise<Wallet>;
}
