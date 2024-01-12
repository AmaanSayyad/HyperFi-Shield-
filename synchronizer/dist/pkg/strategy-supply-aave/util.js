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
    const [userAddr, amount] = e.args;
    return {
        strategyId,
        hash: e.transactionHash,
        block: e.blockNumber,
        type,
        wallet: userAddr,
        data: {
            token: {
                amount: amount.toString(),
            },
        },
    };
};
exports.toEvent = toEvent;
