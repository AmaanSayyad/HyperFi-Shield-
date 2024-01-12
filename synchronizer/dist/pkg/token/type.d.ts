import { AddressAndNetwork, Networks, TokenSymbol } from "../../synchronizer";
export declare type Token = {
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
export declare type Response = {
    data?: unknown;
    meta?: unknown;
    error?: string;
};
export declare type Context = {
    ns: Networks;
    contracts: AddressAndNetwork[];
};
export declare type TokensResponse = Response & {
    data?: {
        tokens: Token[];
    };
    meta?: {
        count: number;
    };
};
export declare type NativeTokenResponse = Response & {
    data?: {
        token: Token;
    };
};
