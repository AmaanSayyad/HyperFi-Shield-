import { Provider } from "@ethersproject/abstract-provider";
import { ICache } from "../cache/type";
import { ITokenManager, Token } from "./type";
export declare class Manager implements ITokenManager {
    private client;
    private cache;
    private provider;
    constructor(url: string, provider: Provider, cache: ICache);
    getNativeToken(wallet: string): Promise<Token>;
    getTokens(wallet: string, contracts: string[]): Promise<Token[]>;
}
