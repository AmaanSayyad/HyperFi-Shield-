"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = require("express");
const handler_1 = require("./handler");
const Router = (ctx) => {
    const router = (0, express_1.Router)();
    router.get("/tokens/:wallet", (0, handler_1.getTokensHandler)(ctx));
    router.get("/native-token/:wallet", (0, handler_1.getNativeTokenHandler)(ctx));
    return router;
};
exports.Router = Router;
