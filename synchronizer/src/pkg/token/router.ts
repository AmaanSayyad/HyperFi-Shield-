import { Router as RouterExpress } from "express";
import { Context } from "./type";
import { getTokensHandler, getNativeTokenHandler } from "./handler";

export const Router = (ctx: Context) => {
  const router = RouterExpress();

  router.get("/tokens/:wallet", getTokensHandler(ctx));
  router.get("/native-token/:wallet", getNativeTokenHandler(ctx));

  return router;
};
