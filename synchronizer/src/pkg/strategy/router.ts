import { Router as RouterExpress } from "express";
import { Context } from "./type";
import { getStrategiesHandler, getStrategiesByNetworksHandler, getStrategiesBalancesHandler } from "./handler";

export const Router = (ctx: Context) => {
  const router = RouterExpress();

  router.get("/strategies", getStrategiesHandler(ctx));
  router.get("/strategies-by-networks", getStrategiesByNetworksHandler(ctx));
  router.get("/strategies-balances", getStrategiesBalancesHandler(ctx));

  return router;
};
