import { Entity, Column, ManyToOne } from "typeorm";
import { SupplyAaveEvent } from "./type";
import { EventModel } from "../strategy/model-event";
import { SupplyAaveStrategyModel } from "./model-strategy";

@Entity({
  name: "supply_aave_event",
})
export class SupplyAaveEventModel extends EventModel {
  @Column({
    type: "text",
  })
  amount: string;

  @ManyToOne(() => SupplyAaveStrategyModel, (strategy) => strategy.events)
  strategy: SupplyAaveStrategyModel;

  public from(t: SupplyAaveEvent): void {
    this.strategyId = t.strategyId;
    this.hash = t.hash;
    this.block = t.block;
    this.type = t.type;
    this.wallet = t.wallet;

    this.amount = t.data.token.amount;
  }

  public to(): SupplyAaveEvent {
    return {
      id: this.id,
      strategyId: this.strategyId,
      hash: this.hash,
      block: this.block,
      type: this.type,
      wallet: this.wallet,
      createdAt: this.createdAt.getTime(),
      data: {
        token: {
          amount: this.amount,
        },
      },
    };
  }
}
