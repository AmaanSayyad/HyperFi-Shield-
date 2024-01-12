import { Network } from "../../synchronizer";
export declare const ERROR_MSG_INVALID_ENV = "invalid env env value";
export declare type NetworkENV = {
    NAME: Network;
    ALCHEMY_API_KEY: string;
};
export declare type Environment = {
    NODE_ENV: string;
    PRIVATE_KEY: string;
    DATABASE_URL: string;
    PORT: number;
    INTERVAL_SECONDS: number;
    NETWORKS: string;
    NETWORK: {
        [key in Network]: NetworkENV;
    };
};
