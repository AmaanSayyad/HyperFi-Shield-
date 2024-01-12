"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNetworkValid = void 0;
const isNetworkValid = (networkName) => {
    switch (networkName) {
        // case "eth":
        case "matic":
        case "maticmum":
            let nn = networkName;
            return true;
        default:
            return false;
    }
};
exports.isNetworkValid = isNetworkValid;
