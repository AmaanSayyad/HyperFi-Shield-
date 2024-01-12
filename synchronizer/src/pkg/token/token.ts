import { createAlchemyWeb3, AlchemyWeb3, TokenMetadataResponse } from "@alch/alchemy-web3";
import { BigNumber } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { ICache } from "../cache/type";
import { ITokenManager, Token } from "./type";
import { NativeTokenSymbol, Network, TokenSymbol } from "../../synchronizer";

export class Manager implements ITokenManager {
  private client: AlchemyWeb3;
  private cache: ICache;
  private provider: Provider;

  constructor(url: string, provider: Provider, cache: ICache) {
    this.client = createAlchemyWeb3(url);
    this.provider = provider;
    this.cache = cache;
  }

  public async getNativeToken(wallet: string): Promise<Token> {
    try {
      // get native token balance
      const balance = await this.provider.getBalance(wallet);

      // get native token symbol
      const networkInfo = await this.provider.getNetwork();
      const symbol = NativeTokenSymbol[networkInfo.name as Network];

      // define native token
      const token: Token = {
        balance: balance.toString(),
        symbol,
        decimals: 18,
        isNative: true,
      };

      return token;
    } catch (err) {
      throw err;
    }
  }

  public async getTokens(wallet: string, contracts: string[]): Promise<Token[]> {
    try {
      console.log("1111");
      console.log("1111");
      console.log("1111", contracts);
      // define tokens array with native token
      const tokens: Token[] = [];

      // get tokens contras
      const balances = await this.client.alchemy.getTokenBalances(wallet, contracts);

      // check if token balances is empty
      if (!balances.tokenBalances.length) {
        return tokens;
      }

      for (const { error, tokenBalance, contractAddress: contract } of balances.tokenBalances) {
        if (error) {
          console.warn(`can't get balance for token_addr=${contract} err=${error}`);
        }

        // parse balance to bignumber format
        const balance = BigNumber.from(tokenBalance);

        // get token metadata from the cache, if cache not present fetch to alchemy
        let meta: TokenMetadataResponse;
        if (this.cache.has(contract)) {
          meta = this.cache.get(contract);
        } else {
          meta = await this.client.alchemy.getTokenMetadata(contract);
          this.cache.set(contract, meta);
        }

        // check if decimal are present, if not stop the iteration
        if (!meta.decimals) {
          console.warn(`can't get meta decimals for token_addr=${contract}`);
          continue;
        }

        // TODO(ca): move to base util file
        // prepare symbol
        let symbol: TokenSymbol;
        switch (meta.symbol) {
          case "ETH":
          case "WETH":
          case "MATIC":
          case "LINK":
          case "WMATIC":
            symbol = meta.symbol;
            break;

          default:
            throw new Error(`invalid token_symbol=${meta.symbol}`);
        }

        // prepare token
        const token: Token = {
          balance: balance.toString(),
          decimals: meta.decimals!,
          symbol,
          address: contract,
          isNative: false,
        };

        tokens.push(token);
      }

      return tokens;
    } catch (err) {
      throw err;
    }
  }
}
