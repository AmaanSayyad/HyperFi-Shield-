import { Provider } from "@ethersproject/abstract-provider";
import { ITokenManager } from "./pkg/token/type";

export interface ICron {
  run(): Promise<void>;
  stop(): void;
}

export enum TokenType {
  WETH = "WETH",
  ETH = "ETH",
  MATIC = "MATIC",
  WMATIC = "WMATIC",
  LINK = "LINK",
}

// export type Network = "eth" | "matic" | "maticmum" | "link";
export type Network = "maticmum" | "matic";
export type TokenSymbol = "ETH" | "WETH" | "MATIC" | "WMATIC" | "LINK";

export const NativeTokenSymbol: {
  [key in Network]: TokenSymbol;
} = {
  // eth: "ETH",
  matic: "MATIC",
  maticmum: "MATIC",
  // link: "LINK",
};

export type Wallet = {
  id: string;
  network: Network;
  address: string;
  createdAt: Date;
};

export type Networks = {
  [key in Network]: {
    provider: Provider;
    tm: ITokenManager;
  };
};

export type AddressAndNetwork = {
  address: string;
  network: Network;
};
