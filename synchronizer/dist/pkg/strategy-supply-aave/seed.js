"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seed = void 0;
const Seed = async (storage) => {
    const strategies = [
        {
            name: "Supply Aave WMATIC",
            type: "supply-aave",
            contract: "0x125dF0B4Ab64Bf6AeD9Fdac6FbaBc4Cf441614B7",
            network: "maticmum",
            data: {
                token: {
                    symbol: "WMATIC",
                    address: "0xb685400156cF3CBE8725958DeAA61436727A30c3",
                    dataFeedAddr: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
                    dataFeedFactor: "100000000",
                },
            },
            // user_wallet: 0x57ac4E23aE911Cb3aEDAfE9ABb8E68a68F7CC463
        },
        {
            name: "Supply Aave WMATIC",
            type: "supply-aave",
            contract: "0xe47fF9b7Ae4888492cEB892cb52ab43fcD08b2aC",
            network: "matic",
            data: {
                token: {
                    symbol: "WMATIC",
                    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    dataFeedAddr: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
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
