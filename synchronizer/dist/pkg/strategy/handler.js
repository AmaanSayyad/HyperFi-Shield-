"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStrategiesBalancesHandler = exports.getStrategiesByNetworksHandler = exports.getStrategiesHandler = void 0;
const type_1 = require("./type");
const util_1 = require("../../util");
const ethers_1 = require("ethers");
const getStrategiesHandler = (ctx) => {
    return async (req, res) => {
        const strategies = [];
        strategies.push(...ctx.strategies.supplyUniswap.map((s) => s.strategy));
        strategies.push(...ctx.strategies.supplyAave.map((s) => s.strategy));
        const response = {
            data: {
                strategies,
            },
        };
        res.json(response);
    };
};
exports.getStrategiesHandler = getStrategiesHandler;
const getStrategiesByNetworksHandler = (ctx) => {
    return async (req, res) => {
        const networks = {};
        // define callback to use on forEach
        const cb = (s) => {
            const info = s.strategy;
            if (!networks[info.network]) {
                networks[info.network] = [];
            }
            networks[info.network].push(info);
        };
        // parse strategies
        ctx.strategies.supplyUniswap.forEach(cb);
        ctx.strategies.supplyAave.forEach(cb);
        const response = {
            data: {
                strategies: networks,
            },
        };
        res.json(response);
    };
};
exports.getStrategiesByNetworksHandler = getStrategiesByNetworksHandler;
const getStrategiesBalancesHandler = (ctx) => {
    return async (req, res) => {
        // get query params
        const { wallet, network: networkName } = req.query;
        // check wallet parm
        if (!wallet || !ethers_1.utils.isAddress(wallet)) {
            const response = {
                error: `invalid param wallet=${wallet}`,
            };
            return res.status(400).json(response);
        }
        // check network param
        if (!networkName || !(0, util_1.isNetworkValid)(networkName)) {
            const response = {
                error: `invalid param network=${networkName}`,
            };
            return res.status(400).json(response);
        }
        try {
            // define total sum for deposits/withdraws
            let totalDeposits = 0;
            let totalWithdraws = 0;
            // sum aave strategies deposits/withdraws
            for (let i = 0; i < ctx.strategies.supplyAave.length; i++) {
                const strategy = ctx.strategies.supplyAave[i];
                // check if the network is valid
                if (strategy.strategy.network != networkName) {
                    continue;
                }
                // get deposits from database
                const deposits = await strategy.listEventsUSD(wallet, type_1.EventType.Deposit);
                // reduce sum deposits and sum with global value
                const sumDeposits = deposits.reduce((s, deposit) => {
                    var _a;
                    return s + Number((_a = deposit.data) === null || _a === void 0 ? void 0 : _a.token.amount);
                }, 0);
                totalDeposits += sumDeposits;
                // get withdraws from database
                const withdraws = await strategy.listEventsUSD(wallet, type_1.EventType.Withdraw);
                // reduce sum withdraws
                const sumWithdraws = withdraws.reduce((s, withdraw) => {
                    var _a;
                    return s + Number((_a = withdraw.data) === null || _a === void 0 ? void 0 : _a.token.amount);
                }, 0);
                totalWithdraws += sumWithdraws;
            }
            // sum uniswap strategies deposits/withdraws
            for (let i = 0; i < ctx.strategies.supplyUniswap.length; i++) {
                const strategy = ctx.strategies.supplyUniswap[i];
                // check if the network is valid
                if (strategy.strategy.network != networkName) {
                    continue;
                }
                // get deposits from database
                const deposits = await strategy.listEventsUSD(wallet, type_1.EventType.Deposit);
                // reduce sum deposits and sum with global value
                const sumDeposits = deposits.reduce((sum, deposit) => {
                    return sum + Number(deposit.data.token0.amount) + Number(deposit.data.token1.amount);
                }, 0);
                totalDeposits += sumDeposits;
                // get withdraws from database
                const withdraws = await strategy.listEventsUSD(wallet, type_1.EventType.Withdraw);
                // reduce sum withdraws
                const sumWithdraws = withdraws.reduce((sum, withdraw) => {
                    return sum + Number(withdraw.data.token0.amount) + Number(withdraw.data.token1.amount);
                }, 0);
                totalWithdraws += sumWithdraws;
            }
            const response = {
                data: {
                    deposits: totalDeposits.toString(),
                    withdraws: totalWithdraws.toString(),
                    balance: (totalDeposits - totalWithdraws).toString(),
                },
            };
            res.json(response);
        }
        catch (err) {
            const response = {
                error: err.message,
            };
            res.json(response);
        }
    };
};
exports.getStrategiesBalancesHandler = getStrategiesBalancesHandler;
