import { ICache } from "./type";
export declare class Cache implements ICache {
    private map;
    constructor();
    set<T>(key: string, value: T | T[]): void;
    get<T>(key: string): T;
    has(key: string): boolean;
}
