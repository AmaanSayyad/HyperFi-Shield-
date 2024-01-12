import { SupplyAaveEvent } from "./type";
import { EventModel } from "../strategy/model-event";
import { SupplyAaveStrategyModel } from "./model-strategy";
export declare class SupplyAaveEventModel extends EventModel {
    amount: string;
    strategy: SupplyAaveStrategyModel;
    from(t: SupplyAaveEvent): void;
    to(): SupplyAaveEvent;
}
