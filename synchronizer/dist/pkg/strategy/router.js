"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = require("express");
const handler_1 = require("./handler");
const Router = (ctx) => {
    const router = (0, express_1.Router)();
    router.get("/strategies", (0, handler_1.getStrategiesHandler)(ctx));
    router.get("/strategies-by-networks", (0, handler_1.getStrategiesByNetworksHandler)(ctx));
    router.get("/strategies-balances", (0, handler_1.getStrategiesBalancesHandler)(ctx));
    return router;
};
exports.Router = Router;
