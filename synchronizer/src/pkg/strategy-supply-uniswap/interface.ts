import { AddressAndNetwork, Network } from "synchronizer";
import { EventType } from "../strategy/type";
import { SupplyUniswapEvent, SupplyUniswapStrategy } from "./type";

export interface ISupplyUniswapStrategy {
  strategy: SupplyUniswapStrategy;

  init(): Promise<void>;
  close(): Promise<void>;
  insertEvents(tt: SupplyUniswapEvent[]): Promise<SupplyUniswapEvent[]>;
  listEvents(wallet: string, type: EventType): Promise<SupplyUniswapEvent[]>;
  listEventsByHashes(hashes: string[]): Promise<SupplyUniswapEvent[]>;
  getLastEventByType(type: EventType): Promise<SupplyUniswapEvent>;
  getTokensAddresses(): Promise<AddressAndNetwork[]>;
  listEventsUSD(wallet: string, type: EventType): Promise<SupplyUniswapEvent[]>;
}

export interface ISupplyUniswapStorage {
  init(): Promise<void>;
  close(): Promise<void>;
  insertEvents(tt: SupplyUniswapEvent[]): Promise<SupplyUniswapEvent[]>;
  listEvents(strategyId: number, wallet: string, type: EventType): Promise<SupplyUniswapEvent[]>;
  listEventsByHashes(strategyId: number, hashes: string[]): Promise<SupplyUniswapEvent[]>;
  getLastEventByType(strategyId: number, type: EventType): Promise<SupplyUniswapEvent>;
  createStrategy(s: SupplyUniswapStrategy): Promise<SupplyUniswapStrategy>;
  listStrategies(network?: Network): Promise<SupplyUniswapStrategy[]>;
  getStrategy(s: SupplyUniswapStrategy): Promise<SupplyUniswapStrategy | undefined>;
}
