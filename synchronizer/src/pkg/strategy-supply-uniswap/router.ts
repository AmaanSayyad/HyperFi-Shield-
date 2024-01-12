import { Router as RouterExpress } from "express";
import { Context } from "./type";
import { getDepositsHandler, getWithdrawsHandler, getBalancesHandler } from "./handler";

export const Router = (ctx: Context) => {
  const router = RouterExpress();

  router.get("/supply-uniswap/deposits", getDepositsHandler(ctx));
  router.get("/supply-uniswap/withdraws", getWithdrawsHandler(ctx));
  router.get("/supply-uniswap/balances", getBalancesHandler(ctx));

  return router;
};
