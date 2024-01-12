"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokensHandler = exports.getNativeTokenHandler = void 0;
const ethers_1 = require("ethers");
const util_1 = require("../../util");
const getNativeTokenHandler = (ctx) => {
    return async (req, res) => {
        // get params
        const { wallet } = req.params;
        const { network: networkName } = req.query;
        // check wallet parm
        if (!wallet || !ethers_1.utils.isAddress(wallet)) {
            const response = {
                error: `invalid param wallet=${wallet}`,
            };
            return res.status(400).json(response);
        }
        // check network param
        if (!networkName || !(0, util_1.isNetworkValid)(networkName)) {
            const response = {
                error: `invalid param network=${networkName}`,
            };
            return res.status(400).json(response);
        }
        try {
            // get tokens from manager
            // TODO(ca): check the hardcoded contract address
            const token = await ctx.ns[networkName].tm.getNativeToken(wallet);
            // prepare and send api response
            const response = {
                data: {
                    token,
                },
            };
            res.json(response);
        }
        catch (err) {
            const response = {
                error: err.message,
            };
            res.json(response);
        }
    };
};
exports.getNativeTokenHandler = getNativeTokenHandler;
const getTokensHandler = (ctx) => {
    return async (req, res) => {
        // get params
        const { wallet } = req.params;
        const { network: networkName } = req.query;
        // check wallet parm
        if (!wallet || !ethers_1.utils.isAddress(wallet)) {
            const response = {
                error: `invalid param wallet=${wallet}`,
            };
            return res.status(400).json(response);
        }
        // check network param
        if (!networkName || !(0, util_1.isNetworkValid)(networkName)) {
            const response = {
                error: `invalid param network=${networkName}`,
            };
            return res.status(400).json(response);
        }
        try {
            // filter tokens by networkName
            const filtered = [...new Set(ctx.contracts.filter((c) => c.network === networkName).map((c) => c.address))];
            // get tokens from manager
            const tokens = await ctx.ns[networkName].tm.getTokens(wallet, filtered);
            // prepare and send api response
            const response = {
                data: {
                    tokens,
                },
                meta: {
                    count: tokens.length,
                },
            };
            res.json(response);
        }
        catch (err) {
            const response = {
                error: err.message,
            };
            res.json(response);
        }
    };
};
exports.getTokensHandler = getTokensHandler;
