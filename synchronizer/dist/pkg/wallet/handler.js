"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.walletsHandler = void 0;
const ethers_1 = require("ethers");
const util_1 = require("../../util");
// TODO(ca): add support to recieve "all" network param (or void value)
const walletsHandler = (ctx) => {
    return async (req, res) => {
        // get params
        const { network: networkName } = req.query;
        // check network param
        if (!networkName || !(0, util_1.isNetworkValid)(networkName)) {
            const response = {
                error: `invalid param network=${networkName}`,
            };
            return res.status(400).json(response);
        }
        try {
            // get wallet count from database
            const wallets = await ctx.wm.listWallets(networkName);
            // prepare and send api response
            const response = {
                meta: {
                    count: wallets.length,
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
exports.walletsHandler = walletsHandler;
const loginHandler = (ctx) => {
    return async (req, res) => {
        // get params
        const { wallet: walletAddr } = req.params;
        const { network: networkName } = req.query;
        // check wallet parm
        if (!walletAddr || !ethers_1.utils.isAddress(walletAddr)) {
            const response = {
                error: `invalid param wallet=${walletAddr}`,
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
            // make login into database
            const wallet = await ctx.wm.login(networkName, walletAddr);
            // prepare and send api response
            const response = {
                data: {
                    address: wallet.address,
                    ens: "",
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
exports.loginHandler = loginHandler;
