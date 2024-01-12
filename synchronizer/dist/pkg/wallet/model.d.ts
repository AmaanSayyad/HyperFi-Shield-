import { Network, Wallet } from "../../synchronizer";
export declare class WalletModel {
    id: string;
    network: Network;
    address: string;
    createdAt: Date;
    from(t: Wallet): void;
    to(): Wallet;
}
