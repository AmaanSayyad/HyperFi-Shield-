import { Provider } from "@ethersproject/abstract-provider";
import { AggregatorV3Interface, AggregatorV3Interface__factory } from "../../typechain/aggregator-v3";
import { ERC20, ERC20__factory } from "../../typechain/erc20";
import { BigNumber, ethers } from "ethers";

export default class DataFeed {
  private tokenContract: ERC20;
  private dataFeedContract: AggregatorV3Interface;
  private factor: number;

  constructor(provider: Provider, tokenAddr: string, dataFeedAddr: string, factor: number) {
    this.factor = factor;

    this.tokenContract = new ethers.Contract(tokenAddr, ERC20__factory.abi, provider) as ERC20;

    this.dataFeedContract = new ethers.Contract(
      dataFeedAddr,
      AggregatorV3Interface__factory.abi,
      provider
    ) as AggregatorV3Interface;
  }

  public async getPrice(): Promise<number> {
    const [, price] = await this.dataFeedContract.latestRoundData();
    return price.toNumber() / this.factor;
  }
}
