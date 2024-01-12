import "reflect-metadata";

// import contract dependencies
import { MockSupplyAave, MockSupplyAave__factory } from "../../typechain/supply-aave";
import { SupplyUni, SupplyUni__factory } from "../../typechain/supply-uniswap";

// load env values
import dotenv from "dotenv";
dotenv.config();

// import packages
// import * as supplyAave from "../../pkg/strategy-supply-aave";
import * as strategy from "../../pkg/strategy";
import * as supplyUniswap from "../../pkg/strategy-supply-uniswap";
import * as supplyAave from "../../pkg/strategy-supply-aave";
import * as wallet from "../../pkg/wallet";
import * as token from "../../pkg/token";
import { EnvParser } from "../../pkg/env-parser";
import { Cache } from "../../pkg/cache";
import { AddressAndNetwork, Networks } from "../../synchronizer";

import { ethers } from "ethers";
import express, { Response } from "express";
import { Server } from "http";
// import cors from "cors";

// define logger
import log from "pino";
const logger = log();

// define global instances
let api: Server;
let wm: wallet.IWalletManager;

// change process title
process.title = "synchronizer";

async function main() {
  try {
    // get env values
    const env = EnvParser();

    // initialize api
    const app = express();

    // define cors
    // app.use(cors());

    // TODO(ca): remove below when not needed to use ngrok tunnel solution
    app.use((_, res: Response, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // run database package
    wm = new wallet.Manager(env.DATABASE_URL);
    await wm.init();
    app.use("/api/v1", wallet.Router({ wm }));

    // intialize cache package
    const cache = new Cache();

    // initialize providers
    const maticmumProvider = new ethers.providers.AlchemyProvider("maticmum", env.NETWORK["maticmum"].ALCHEMY_API_KEY);
    const maticProvider = new ethers.providers.AlchemyProvider("matic", env.NETWORK["matic"].ALCHEMY_API_KEY);

    // define networks for service
    const networks: Networks = {
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
    const contracts: AddressAndNetwork[] = [];

    // initialize supply uniswap storage
    const supplyUniswapStorage = new supplyUniswap.Storage(env.DATABASE_URL);
    await supplyUniswapStorage.init();
    await supplyUniswap.Seed(supplyUniswapStorage);

    // get supply uniswap strategies
    const supplyUniswapStrategies = await supplyUniswapStorage.listStrategies();

    // iterate supply uniswap strategies
    const supplyUniswapStrategiesInstances: supplyUniswap.ISupplyUniswapStrategy[] = [];
    for (let i = 0; i < supplyUniswapStrategies.length; i++) {
      const strategyInfo = supplyUniswapStrategies[i];
      const { provider } = networks[strategyInfo.network];

      // intialize contract
      const contract = new ethers.Contract(strategyInfo.contract, SupplyUni__factory.abi, provider) as SupplyUni;

      // initialize each supply uniswap
      const strategy = new supplyUniswap.Strategy(strategyInfo, supplyUniswapStorage, env.INTERVAL_SECONDS, contract);
      await strategy.init();

      supplyUniswapStrategiesInstances.push(strategy);

      // get and push strategy addresses
      const addrs = await strategy.getTokensAddresses();
      contracts.push(...addrs);
    }

    // initialize router for supply uniswap strategies
    app.use(
      "/api/v1",
      supplyUniswap.Router({ strategies: supplyUniswapStrategiesInstances, storage: supplyUniswapStorage })
    );

    // initialize supply aave storage
    const supplyAaveStorage = new supplyAave.Storage(env.DATABASE_URL);
    await supplyAaveStorage.init();
    await supplyAave.Seed(supplyAaveStorage);

    // get supply aave strategies
    const supplyAaveStrategies = await supplyAaveStorage.listStrategies();

    // iterate supply aave strategies
    const supplyAaveStrategiesInstances: supplyAave.ISupplyAaveStrategy[] = [];
    for (let i = 0; i < supplyAaveStrategies.length; i++) {
      const strategyInfo = supplyAaveStrategies[i];
      const { provider } = networks[strategyInfo.network];

      // intialize contract
      const contract = new ethers.Contract(
        strategyInfo.contract,
        MockSupplyAave__factory.abi,
        provider
      ) as MockSupplyAave;

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
    app.use(
      "/api/v1",
      strategy.Router({
        strategies: {
          supplyUniswap: supplyUniswapStrategiesInstances,
          supplyAave: supplyAaveStrategiesInstances,
        },
      })
    );

    // initialize api tokens router
    app.use("/api/v1", token.Router({ ns: networks, contracts }));

    api = app.listen(env.PORT, async () => {
      console.log(`Server are listening on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

// listen process event listeners
const signCb = async () => {
  try {
    api.close();
    wm.close();
  } catch (err) {
    logger.info(err);
  }
};
process.on("SIGTERM", signCb);
process.on("SIGINT", signCb);

// run synchronizer
main();
