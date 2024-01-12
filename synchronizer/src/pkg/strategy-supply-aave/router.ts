import { Router as RouterExpress } from "express";
import { Context } from "./type";
import { getDepositsHandler, getWithdrawsHandler, getBalancesHandler } from "./handler";

export const Router = (ctx: Context) => {
  const router = RouterExpress();

  router.get("/supply-aave/deposits", getDepositsHandler(ctx));
  router.get("/supply-aave/withdraws", getWithdrawsHandler(ctx));
  router.get("/supply-aave/balances", getBalancesHandler(ctx));

  return router;
};
