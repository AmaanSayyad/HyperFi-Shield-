import { BigNumber } from "ethers";
import { Request, Response } from "express";
import { utils } from "ethers";
import { Network } from "../../synchronizer";
import { isNetworkValid } from "../../util";
import { BalacesResponse, Context, DepositsResponse, SupplyUniswapEvent, WithdrawsResponse } from "./type";
import { EventType } from "../strategy/type";

export const getDepositsHandler = (ctx: Context) => {
  return async (req: Request, res: Response) => {
    // get query params
    const { wallet, contract, strategyId, network: networkName, usd } = req.query;

    // check wallet param
    if (!wallet || !utils.isAddress(wallet as string)) {
      const response: DepositsResponse = {
        error: `invalid param wallet=${wallet}`,
      };

      return res.status(400).json(response);
    }

    // check contract param
    if (!contract || !utils.isAddress(contract as string)) {
      const response: DepositsResponse = {
        error: `invalid param contract=${contract}`,
      };

      return res.status(400).json(response);
    }

    // check strategy_id param
    if (!strategyId || Number(strategyId) === NaN) {
      const response: DepositsResponse = {
        error: `invalid param strategyId=${strategyId}`,
      };

      return res.status(400).json(response);
    }

    // check network param
    if (!networkName || !isNetworkValid(networkName as Network)) {
      const response: DepositsResponse = {
        error: `invalid param network=${networkName}`,
      };

      return res.status(400).json(response);
    }

    // get strategy
    const strategy = ctx.strategies.find((s) => {
      return (
        s.strategy.network === networkName && s.strategy.contract === contract && s.strategy.id === Number(strategyId)
      );
    });

    // check strategy
    if (!strategy) {
      const response: DepositsResponse = {
        error: `invalid to get strategy with param network=${networkName}, contract=${contract} and strategyId=${strategyId}`,
      };

      return res.status(400).json(response);
    }

    try {
      // get deposits from database
      let deposits: SupplyUniswapEvent[];
      if (usd) {
        deposits = await strategy.listEventsUSD(wallet as string, EventType.Deposit);
      } else {
        deposits = await strategy.listEvents(wallet as string, EventType.Deposit);
      }

      // prepare and send api response
      const response: DepositsResponse = {
        data: {
          deposits,
        },
        meta: {
          count: deposits.length,
        },
      };

      res.json(response);
    } catch (err: any) {
      const response: DepositsResponse = {
        error: err.message,
      };

      res.json(response);
    }
  };
};

export const getWithdrawsHandler = (ctx: Context) => {
  return async (req: Request, res: Response) => {
    // get query params
    const { wallet, contract, strategyId, network: networkName, usd } = req.query;

    // check wallet parm
    if (!wallet || !utils.isAddress(wallet as string)) {
      const response: DepositsResponse = {
        error: `invalid param wallet=${wallet}`,
      };

      return res.status(400).json(response);
    }

    // check wallet contract
    if (!contract || !utils.isAddress(contract as string)) {
      const response: DepositsResponse = {
        error: `invalid param contract=${contract}`,
      };

      return res.status(400).json(response);
    }

    // check strategy_id param
    if (!strategyId || Number(strategyId) === NaN) {
      const response: DepositsResponse = {
        error: `invalid param strategyId=${strategyId}`,
      };

      return res.status(400).json(response);
    }

    // check network param
    if (!networkName || !isNetworkValid(networkName as Network)) {
      const response: DepositsResponse = {
        error: `invalid param network=${networkName}`,
      };

      return res.status(400).json(response);
    }

    // get strategy
    const strategy = ctx.strategies.find((s) => {
      return (
        s.strategy.network === networkName && s.strategy.contract === contract && s.strategy.id === Number(strategyId)
      );
    });

    // check strategy
    if (!strategy) {
      const response: DepositsResponse = {
        error: `invalid to get strategy with param network=${networkName}, contract=${contract} and strategyId=${strategyId}`,
      };

      return res.status(400).json(response);
    }

    try {
      // get withdraws from database
      let withdraws: SupplyUniswapEvent[];
      if (usd) {
        withdraws = await strategy.listEventsUSD(wallet as string, EventType.Withdraw);
      } else {
        withdraws = await strategy.listEvents(wallet as string, EventType.Withdraw);
      }

      // prepare and send api response
      const response: WithdrawsResponse = {
        data: {
          withdraws,
        },
        meta: {
          count: withdraws.length,
        },
      };

      res.json(response);
    } catch (err: any) {
      const response: WithdrawsResponse = {
        error: err.message,
      };

      res.json(response);
    }
  };
};

export const getBalancesHandler = (ctx: Context) => {
  return async (req: Request, res: Response) => {
    // get query params
    const { wallet, contract, strategyId, network: networkName, usd } = req.query;

    // check wallet parm
    if (!wallet || !utils.isAddress(wallet as string)) {
      const response: DepositsResponse = {
        error: `invalid param wallet=${wallet}`,
      };

      return res.status(400).json(response);
    }

    // check wallet contract
    if (!contract || !utils.isAddress(contract as string)) {
      const response: DepositsResponse = {
        error: `invalid param contract=${contract}`,
      };

      return res.status(400).json(response);
    }

    // check strategy_id param
    if (!strategyId || Number(strategyId) === NaN) {
      const response: DepositsResponse = {
        error: `invalid param strategyId=${strategyId}`,
      };

      return res.status(400).json(response);
    }

    // check network param
    if (!networkName || !isNetworkValid(networkName as Network)) {
      const response: DepositsResponse = {
        error: `invalid param network=${networkName}`,
      };

      return res.status(400).json(response);
    }

    // get strategy
    const strategy = ctx.strategies.find((s) => {
      return (
        s.strategy.network === networkName && s.strategy.contract === contract && s.strategy.id === Number(strategyId)
      );
    });

    // check strategy
    if (!strategy) {
      const response: DepositsResponse = {
        error: `invalid to get strategy with param network=${networkName}, contract=${contract} and strategyId=${strategyId}`,
      };

      return res.status(400).json(response);
    }

    try {
      // get deposits from database
      let deposits: SupplyUniswapEvent[];
      if (usd) {
        deposits = await strategy.listEventsUSD(wallet as string, EventType.Deposit);
      } else {
        deposits = await strategy.listEvents(wallet as string, EventType.Deposit);
      }

      // reduce sum deposit
      const [sumDepositsToken0, sumDepositsToken1] = deposits.reduce(
        (sum, deposit) => {
          const [token0, token1] = sum;

          const amount0 = token0 + Number(deposit.data.token0.amount);
          const amount1 = token1 + Number(deposit.data.token1.amount);

          return [amount0, amount1];
        },
        [0, 0]
      );

      // get withdraws from database
      let withdraws: SupplyUniswapEvent[];
      if (usd) {
        withdraws = await strategy.listEventsUSD(wallet as string, EventType.Withdraw);
      } else {
        withdraws = await strategy.listEvents(wallet as string, EventType.Withdraw);
      }

      // reduce sum withdraws
      const [sumWithdrawsToken0, sumWithdrawsToken1] = withdraws.reduce(
        (sum, withdraw) => {
          const [token0, token1] = sum;

          const amount0 = token0 + Number(withdraw.data.token0.amount);
          const amount1 = token1 + Number(withdraw.data.token1.amount);

          return [amount0, amount1];
        },
        [0, 0]
      );

      // prepare and send api response
      const response: BalacesResponse = {
        data: {
          token0: {
            deposits: sumDepositsToken0.toString(),
            withdraws: sumWithdrawsToken0.toString(),
            balance: (sumDepositsToken0 - sumWithdrawsToken0).toString(),
          },
          token1: {
            deposits: sumDepositsToken1.toString(),
            withdraws: sumWithdrawsToken1.toString(),
            balance: (sumDepositsToken1 - sumWithdrawsToken1).toString(),
          },
        },
      };

      res.json(response);
    } catch (err: any) {
      const response: BalacesResponse = {
        error: err.message,
      };

      res.json(response);
    }
  };
};
