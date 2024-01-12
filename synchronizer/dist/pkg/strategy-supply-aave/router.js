"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = require("express");
const handler_1 = require("./handler");
const Router = (ctx) => {
    const router = (0, express_1.Router)();
    router.get("/supply-aave/deposits", (0, handler_1.getDepositsHandler)(ctx));
    router.get("/supply-aave/withdraws", (0, handler_1.getWithdrawsHandler)(ctx));
    router.get("/supply-aave/balances", (0, handler_1.getBalancesHandler)(ctx));
    return router;
};
exports.Router = Router;
