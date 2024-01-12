"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// import contract dependencies
const supply_aave_1 = require("../../typechain/supply-aave");
const supply_uniswap_1 = require("../../typechain/supply-uniswap");
// load env values
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import packages
// import * as supplyAave from "../../pkg/strategy-supply-aave";
const strategy = __importStar(require("../../pkg/strategy"));
const supplyUniswap = __importStar(require("../../pkg/strategy-supply-uniswap"));
const supplyAave = __importStar(require("../../pkg/strategy-supply-aave"));
const wallet = __importStar(require("../../pkg/wallet"));
const token = __importStar(require("../../pkg/token"));
const env_parser_1 = require("../../pkg/env-parser");
const cache_1 = require("../../pkg/cache");
const ethers_1 = require("ethers");
const express_1 = __importDefault(require("express"));
// import cors from "cors";
// define logger
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)();
// define global instances
let api;
let wm;
// change process title
process.title = "synchronizer";
async function main() {
    try {
        // get env values
        const env = (0, env_parser_1.EnvParser)();
        // initialize api
        const app = (0, express_1.default)();
        // define cors
        // app.use(cors());
        // TODO(ca): remove below when not needed to use ngrok tunnel solution
        app.use((_, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        // run database package
        wm = new wallet.Manager(env.DATABASE_URL);
        await wm.init();
        app.use("/api/v1", wallet.Router({ wm }));
        // intialize cache package
        const cache = new cache_1.Cache();
        // initialize providers
        const maticmumProvider = new ethers_1.ethers.providers.AlchemyProvider("maticmum", env.NETWORK["maticmum"].ALCHEMY_API_KEY);
        const maticProvider = new ethers_1.ethers.providers.AlchemyProvider("matic", env.NETWORK["matic"].ALCHEMY_API_KEY);
        // define networks for service
        const networks = {
            maticmum: {
                provider: maticmumProvider,
                tm: new token.Manager(maticmumProvider.connection.url, maticmumProvider, cache),
            },
            matic: {
                provider: maticProvider,
                tm: new token.Manager(maticProvider.connection.url, maticProvider, cache),
            },
        };
        // define contracts addresses array
        const contracts = [];
        // initialize supply uniswap storage
        const supplyUniswapStorage = new supplyUniswap.Storage(env.DATABASE_URL);
        await supplyUniswapStorage.init();
        await supplyUniswap.Seed(supplyUniswapStorage);
        // get supply uniswap strategies
        const supplyUniswapStrategies = await supplyUniswapStorage.listStrategies();
        // iterate supply uniswap strategies
        const supplyUniswapStrategiesInstances = [];
        for (let i = 0; i < supplyUniswapStrategies.length; i++) {
            const strategyInfo = supplyUniswapStrategies[i];
            const { provider } = networks[strategyInfo.network];
            // intialize contract
            const contract = new ethers_1.ethers.Contract(strategyInfo.contract, supply_uniswap_1.SupplyUni__factory.abi, provider);
            // initialize each supply uniswap
            const strategy = new supplyUniswap.Strategy(strategyInfo, supplyUniswapStorage, env.INTERVAL_SECONDS, contract);
            await strategy.init();
            supplyUniswapStrategiesInstances.push(strategy);
            // get and push strategy addresses
            const addrs = await strategy.getTokensAddresses();
            contracts.push(...addrs);
        }
        // initialize router for supply uniswap strategies
        app.use("/api/v1", supplyUniswap.Router({ strategies: supplyUniswapStrategiesInstances, storage: supplyUniswapStorage }));
        // initialize supply aave storage
        const supplyAaveStorage = new supplyAave.Storage(env.DATABASE_URL);
        await supplyAaveStorage.init();
        await supplyAave.Seed(supplyAaveStorage);
        // get supply aave strategies
        const supplyAaveStrategies = await supplyAaveStorage.listStrategies();
        // iterate supply aave strategies
        const supplyAaveStrategiesInstances = [];
        for (let i = 0; i < supplyAaveStrategies.length; i++) {
            const strategyInfo = supplyAaveStrategies[i];
            const { provider } = networks[strategyInfo.network];
            // intialize contract
            const contract = new ethers_1.ethers.Contract(strategyInfo.contract, supply_aave_1.MockSupplyAave__factory.abi, provider);
            // initialize each supply uniswap
            const strategy = new supplyAave.Strategy(strategyInfo, supplyAaveStorage, env.INTERVAL_SECONDS, contract);
            await strategy.init();
            supplyAaveStrategiesInstances.push(strategy);
            // get and push strategy addresses
            const addrs = await strategy.getTokensAddresses();
            contracts.push(...addrs);
        }
        // initialize router for supply aave strategies
        app.use("/api/v1", supplyAave.Router({ strategies: supplyAaveStrategiesInstances, storage: supplyAaveStorage }));
        // intialize api strategies router
        app.use("/api/v1", strategy.Router({
            strategies: {
                supplyUniswap: supplyUniswapStrategiesInstances,
                supplyAave: supplyAaveStrategiesInstances,
            },
        }));
        // initialize api tokens router
        app.use("/api/v1", token.Router({ ns: networks, contracts }));
        api = app.listen(env.PORT, async () => {
            console.log(`Server are listening on port ${env.PORT}`);
        });
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
}
// listen process event listeners
const signCb = async () => {
    try {
        api.close();
        wm.close();
    }
    catch (err) {
        logger.info(err);
    }
};
process.on("SIGTERM", signCb);
process.on("SIGINT", signCb);
// run synchronizer
main();
