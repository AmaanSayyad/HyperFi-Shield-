import { Provider } from "@ethersproject/abstract-provider";
export default class DataFeed {
    private tokenContract;
    private dataFeedContract;
    private factor;
    constructor(provider: Provider, tokenAddr: string, dataFeedAddr: string, factor: number);
    getPrice(): Promise<number>;
}
