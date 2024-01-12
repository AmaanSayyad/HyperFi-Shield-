import { AddressAndNetwork, Network } from "../../synchronizer";
import { EventType } from "../strategy/type";
import { SupplyAaveEvent, SupplyAaveStrategy } from "./type";

export interface ISupplyAaveStrategy {
  strategy: SupplyAaveStrategy;

  init(): Promise<void>;
  close(): Promise<void>;
  insertEvents(tt: SupplyAaveEvent[]): Promise<SupplyAaveEvent[]>;
  listEvents(wallet: string, type: EventType): Promise<SupplyAaveEvent[]>;
  listEventsByHashes(hashes: string[]): Promise<SupplyAaveEvent[]>;
  getLastEventByType(type: EventType): Promise<SupplyAaveEvent>;
  getTokensAddresses(): Promise<AddressAndNetwork[]>;
  listEventsUSD(wallet: string, type: EventType): Promise<SupplyAaveEvent[]>;
}

export interface ISupplyAaveStorage {
  init(): Promise<void>;
  close(): Promise<void>;
  insertEvents(tt: SupplyAaveEvent[]): Promise<SupplyAaveEvent[]>;
  listEvents(strategyId: number, wallet: string, type: EventType): Promise<SupplyAaveEvent[]>;
  listEventsByHashes(strategyId: number, hashes: string[]): Promise<SupplyAaveEvent[]>;
  getLastEventByType(strategyId: number, type: EventType): Promise<SupplyAaveEvent>;
  createStrategy(s: SupplyAaveStrategy): Promise<SupplyAaveStrategy>;
  listStrategies(network?: Network): Promise<SupplyAaveStrategy[]>;
  getStrategy(s: SupplyAaveStrategy): Promise<SupplyAaveStrategy | undefined>;
}
