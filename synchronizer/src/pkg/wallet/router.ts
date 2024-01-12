import { Router as RouterExpress } from "express";
import { Context } from "./type";
import { loginHandler, walletsHandler } from "./handler";

export const Router = (ctx: Context) => {
  const router = RouterExpress();

  router.post("/wallets/:wallet/login", loginHandler(ctx));
  router.get("/wallets", walletsHandler(ctx));

  return router;
};
