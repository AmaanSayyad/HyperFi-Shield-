"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seed = void 0;
const Seed = async (storage) => {
    const strategies = [
        {
            name: "Supply Uniswap WMATIC/WETH",
            network: "maticmum",
            type: "supply-uniswap",
            contract: "0x7F855BDcb03bCb6e3b66Ecbd028363397174481a",
            data: {
                poolId: "0",
                poolFee: "100",
                token0: {
                    symbol: "WMATIC",
                    address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                    dataFeedAddr: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
                    dataFeedFactor: "100000000",
                },
                token1: {
                    symbol: "WETH",
                    address: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
                    dataFeedAddr: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
                    dataFeedFactor: "100000000",
                },
            },
            // user_wallet: 0xa2e50fbBE2D73cd9E2c6e2c97E8Beac17B22C957
        },
        {
            name: "Supply Uniswap WMATIC/WETH",
            type: "supply-uniswap",
            network: "matic",
            contract: "0xC9Fc250Ab92a802fCc96719eBE17c9c831aDF264",
            data: {
                poolId: "1",
                poolFee: "100",
                token0: {
                    symbol: "WMATIC",
                    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    dataFeedAddr: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
                    dataFeedFactor: "100000000",
                },
                token1: {
                    symbol: "WETH",
                    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                    dataFeedAddr: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
                    dataFeedFactor: "100000000",
                },
            },
            // user_wallet: 0xa2e50fbBE2D73cd9E2c6e2c97E8Beac17B22C957
        },
    ];
    const results = [];
    for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        // get current strategy, if exists continue on loop
        const find = await storage.getStrategy(strategy);
        if (find) {
            continue;
        }
        // create strategy
        const createdStrategy = await storage.createStrategy(strategy);
        results.push(createdStrategy);
    }
    return results;
};
exports.Seed = Seed;
