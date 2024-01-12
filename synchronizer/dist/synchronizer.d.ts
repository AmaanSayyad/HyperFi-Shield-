import { Provider } from "@ethersproject/abstract-provider";
import { ITokenManager } from "./pkg/token/type";
export interface ICron {
    run(): Promise<void>;
    stop(): void;
}
export declare enum TokenType {
    WETH = "WETH",
    ETH = "ETH",
    MATIC = "MATIC",
    WMATIC = "WMATIC",
    LINK = "LINK"
}
export declare type Network = "maticmum" | "matic";
export declare type TokenSymbol = "ETH" | "WETH" | "MATIC" | "WMATIC" | "LINK";
export declare const NativeTokenSymbol: {
    [key in Network]: TokenSymbol;
};
export declare type Wallet = {
    id: string;
    network: Network;
    address: string;
    createdAt: Date;
};
export declare type Networks = {
    [key in Network]: {
        provider: Provider;
        tm: ITokenManager;
    };
};
export declare type AddressAndNetwork = {
    address: string;
    network: Network;
};
