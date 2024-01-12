import { TokenSymbol } from "../../synchronizer";
import { Column, Entity, OneToMany } from "typeorm";
import { StrategyModel } from "../strategy/model-strategy";
import { SupplyUniswapEventModel } from "./model-event";
import { SupplyUniswapStrategy } from "./type";

@Entity({
  name: "supply_uniswap_strategy",
})
export class SupplyUniswapStrategyModel extends StrategyModel {
  @Column({ type: "text" })
  poolId: string;

  @Column({ type: "text" })
  token0Symbol: TokenSymbol;

  @Column({ type: "text" })
  token0Addr: string;

  @Column({ type: "text" })
  token0DataFeedAddr: string;

  @Column({ type: "text" })
  token0DataFeedFactor: string;

  @Column({ type: "text" })
  token1Symbol: TokenSymbol;

  @Column({ type: "text" })
  token1Addr: string;

  @Column({ type: "text" })
  token1DataFeedAddr: string;

  @Column({ type: "text" })
  token1DataFeedFactor: string;

  @Column({ type: "text" })
  poolFee: string;

  @OneToMany(() => SupplyUniswapEventModel, (event) => event.strategy)
  events: SupplyUniswapEventModel;

  public from(s: SupplyUniswapStrategy): void {
    this.id = s.id!;
    this.name = s.name;
    this.type = s.type;
    this.network = s.network;
    this.contract = s.contract;

    this.poolId = s.data.poolId;
    this.poolFee = s.data.poolFee;

    this.token0Symbol = s.data.token0.symbol;
    this.token0Addr = s.data.token0.address;
    this.token0DataFeedAddr = s.data.token0.dataFeedAddr;
    this.token0DataFeedFactor = s.data.token0.dataFeedFactor;

    this.token1Symbol = s.data.token1.symbol;
    this.token1Addr = s.data.token1.address;
    this.token1DataFeedAddr = s.data.token1.dataFeedAddr;
    this.token1DataFeedFactor = s.data.token1.dataFeedFactor;
  }

  public to(): SupplyUniswapStrategy {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      network: this.network,
      contract: this.contract,
      data: {
        poolId: this.poolId,
        poolFee: this.poolFee,
        token0: {
          symbol: this.token0Symbol,
          address: this.token0Addr,
          dataFeedAddr: this.token0DataFeedAddr,
          dataFeedFactor: this.token0DataFeedFactor,
        },
        token1: {
          symbol: this.token1Symbol,
          address: this.token1Addr,
          dataFeedAddr: this.token1DataFeedAddr,
          dataFeedFactor: this.token1DataFeedFactor,
        },
      },
    };
  }
}
