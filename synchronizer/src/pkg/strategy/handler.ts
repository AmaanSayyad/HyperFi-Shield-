import {
  Context,
  StrategiesResponse,
  StrategiesByNetworkResponse,
  EventType,
  StrategiesBalancesResponse,
} from "./type";
import { Request, Response } from "express";
import { isNetworkValid } from "../../util";
import { Network } from "../../synchronizer";
import { utils } from "ethers";
import { SupplyAaveEvent } from "../strategy-supply-aave/type";
import { SupplyUniswapEvent } from "../strategy-supply-uniswap/type";

export const getStrategiesHandler = (ctx: Context) => {
  return async (req: Request, res: Response) => {
    const strategies: any[] = [];
    strategies.push(...ctx.strategies.supplyUniswap.map((s) => s.strategy));
    strategies.push(...ctx.strategies.supplyAave.map((s) => s.strategy));

    const response: StrategiesResponse = {
      data: {
        strategies,
      },
    };

    res.json(response);
  };
};

export const getStrategiesByNetworksHandler = (ctx: Context) => {
  return async (req: Request, res: Response) => {
    const networks: { [key: string]: any[] } = {};

    // define callback to use on forEach
    const cb = (s: any) => {
      const info = s.strategy;

      if (!networks[info.network]) {
        networks[info.network] = [];
      }

      networks[info.network].push(info);
    };

    // parse strategies
    ctx.strategies.supplyUniswap.forEach(cb);
    ctx.strategies.supplyAave.forEach(cb);

    const response: StrategiesByNetworkResponse = {
      data: {
        strategies: networks,
      },
    };

    res.json(response);
  };
};

export const getStrategiesBalancesHandler = (ctx: Context) => {
  return async (req: Request, res: Response) => {
    // get query params
    const { wallet, network: networkName } = req.query;

    // check wallet parm
    if (!wallet || !utils.isAddress(wallet as string)) {
      const response: StrategiesBalancesResponse = {
        error: `invalid param wallet=${wallet}`,
      };

      return res.status(400).json(response);
    }

    // check network param
    if (!networkName || !isNetworkValid(networkName as Network)) {
      const response: StrategiesBalancesResponse = {
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
        const deposits = await strategy.listEventsUSD(wallet as string, EventType.Deposit);

        // reduce sum deposits and sum with global value
        const sumDeposits = deposits.reduce((s, deposit) => {
          return s + Number(deposit.data?.token.amount);
        }, 0);
        totalDeposits += sumDeposits;

        // get withdraws from database
        const withdraws = await strategy.listEventsUSD(wallet as string, EventType.Withdraw);

        // reduce sum withdraws
        const sumWithdraws = withdraws.reduce((s, withdraw) => {
          return s + Number(withdraw.data?.token.amount);
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
        const deposits = await strategy.listEventsUSD(wallet as string, EventType.Deposit);

        // reduce sum deposits and sum with global value
        const sumDeposits = deposits.reduce((sum, deposit) => {
          return sum + Number(deposit.data.token0.amount) + Number(deposit.data.token1.amount);
        }, 0);
        totalDeposits += sumDeposits;

        // get withdraws from database
        const withdraws = await strategy.listEventsUSD(wallet as string, EventType.Withdraw);

        // reduce sum withdraws
        const sumWithdraws = withdraws.reduce((sum, withdraw) => {
          return sum + Number(withdraw.data.token0.amount) + Number(withdraw.data.token1.amount);
        }, 0);
        totalWithdraws += sumWithdraws;
      }

      const response: StrategiesBalancesResponse = {
        data: {
          deposits: totalDeposits.toString(),
          withdraws: totalWithdraws.toString(),
          balance: (totalDeposits - totalWithdraws).toString(),
        },
      };

      res.json(response);
    } catch (err: any) {
      const response: StrategiesBalancesResponse = {
        error: err.message,
      };

      res.json(response);
    }
  };
};
