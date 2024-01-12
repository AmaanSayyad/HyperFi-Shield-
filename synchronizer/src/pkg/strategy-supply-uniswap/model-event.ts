import { EventModel } from "../strategy/model-event";
import { TokenType } from "../../synchronizer";
import { Entity, Column, ManyToOne } from "typeorm";
import { SupplyUniswapStrategyModel } from "./model-strategy";
import { SupplyUniswapEvent } from "./type";

@Entity({ name: "suply_uniswap_event" })
export class SupplyUniswapEventModel extends EventModel {
  @Column({ type: "text" })
  token0Addr: string;

  @Column({ type: "text" })
  amount0: string;

  @Column({ type: "text" })
  token1Addr: string;

  @Column({ type: "text" })
  amount1: string;

  @Column({ type: "text" })
  poolId: string;

  @Column({ type: "text" })
  poolFee: string;

  @ManyToOne(() => SupplyUniswapStrategyModel, (strategy) => strategy.events)
  strategy: SupplyUniswapStrategyModel;

  public from(t: SupplyUniswapEvent): void {
    this.strategyId = t.strategyId;
    this.hash = t.hash;
    this.block = t.block;
    this.type = t.type;
    this.wallet = t.wallet;

    this.token0Addr = t.data.token0.address;
    this.amount0 = t.data.token0.amount;
    this.token1Addr = t.data.token1.address;
    this.amount1 = t.data.token1.amount;
    this.poolId = t.data.poolId;
    this.poolFee = t.data.poolFee;
  }

  public to(): SupplyUniswapEvent {
    return {
      strategyId: this.strategyId,
      hash: this.hash,
      block: this.block,
      type: this.type,
      wallet: this.wallet,
      data: {
        poolId: this.poolId,
        poolFee: this.poolFee,
        token0: {
          address: this.token0Addr,
          amount: this.amount0,
        },
        token1: {
          address: this.token1Addr,
          amount: this.amount1,
        },
      },
    };
  }
}
