"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aggregator_v3_1 = require("../../typechain/aggregator-v3");
const erc20_1 = require("../../typechain/erc20");
const ethers_1 = require("ethers");
class DataFeed {
    constructor(provider, tokenAddr, dataFeedAddr, factor) {
        this.factor = factor;
        this.tokenContract = new ethers_1.ethers.Contract(tokenAddr, erc20_1.ERC20__factory.abi, provider);
        this.dataFeedContract = new ethers_1.ethers.Contract(dataFeedAddr, aggregator_v3_1.AggregatorV3Interface__factory.abi, provider);
    }
    async getPrice() {
        const [, price] = await this.dataFeedContract.latestRoundData();
        return price.toNumber() / this.factor;
    }
}
exports.default = DataFeed;
