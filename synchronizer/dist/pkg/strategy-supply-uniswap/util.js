"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEvent = void 0;
const toEvent = (strategyId, e, type) => {
    var _a;
    // check args from event
    if (!((_a = e.args) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error("couldn't create the event, err=invalid args length");
    }
    // parse event
    const [userAddr, poolId, token0Addr, token1Addr, amount0, amount1, poolFee] = e.args;
    return {
        strategyId,
        hash: e.transactionHash,
        block: e.blockNumber,
        type,
        wallet: userAddr,
        data: {
            poolId: poolId.toString(),
            poolFee: poolFee.toString(),
            token0: {
                address: token0Addr,
                amount: amount0.toString(),
            },
            token1: {
                address: token1Addr,
                amount: amount1.toString(),
            },
        },
    };
};
exports.toEvent = toEvent;
