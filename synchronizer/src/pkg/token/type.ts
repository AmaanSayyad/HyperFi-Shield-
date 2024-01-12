import { AddressAndNetwork, Networks, TokenSymbol } from "../../synchronizer";

export type Token = {
  balance: string;
  symbol: TokenSymbol;
  decimals: number;
  address?: string;
  isNative: boolean;
};

export interface ITokenManager {
  getTokens(wallet: string, contracts: string[]): Promise<Token[]>;
  getNativeToken(wallet: string): Promise<Token>;
}

export type Response = {
  data?: unknown;
  meta?: unknown;
  error?: string;
};

export type Context = {
  ns: Networks;
  contracts: AddressAndNetwork[];
};

export type TokensResponse = Response & {
  data?: {
    tokens: Token[];
  };
  meta?: {
    count: number;
  };
};

export type NativeTokenResponse = Response & {
  data?: {
    token: Token;
  };
};
