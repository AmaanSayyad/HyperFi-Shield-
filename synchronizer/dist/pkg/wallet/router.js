"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = require("express");
const handler_1 = require("./handler");
const Router = (ctx) => {
    const router = (0, express_1.Router)();
    router.post("/wallets/:wallet/login", (0, handler_1.loginHandler)(ctx));
    router.get("/wallets", (0, handler_1.walletsHandler)(ctx));
    return router;
};
exports.Router = Router;
