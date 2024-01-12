import { ethers, BigNumber } from 'ethers';

import { networks } from '../../manager.constants';
import {
  Network,
  ChainName,
  Profile,
  Token,
  Withdraw,
  Deposit,
  TokenSymbol,
  DFPStrategy,
  StrategiesByNetworks,
  SupplyAaveStrategy,
  SupplyUniswapStrategy,
  UniswapPosition,
} from '../../manager.types';
import { AdapterName, IAdapter } from '../adapter.types';

import { ERC20__factory } from '../../../../typechain';
import { SupplyAave__factory } from '../../../../typechain-types';
import { SupplyUni__factory } from '../../../../typechain-types-uni';

declare global {
  interface Window {
    ethereum: any;
  }
}

export default class DfpAdapter implements IAdapter {
  private _name: AdapterName;
  private _apiURL: string;
  private _network: Network;
  private _ready: boolean;
  private _profile: Profile;

  constructor(apiURL: string) {
    this._apiURL = apiURL;
    this._name = 'dfp';
    this._network = undefined!;
    this._ready = false;

    this._profile = undefined!;
  }

  private checkMetamaskAvailability(): boolean {
    const { ethereum } = window;
    return !ethereum ? false : true;
  }

  public async initAdapter(): Promise<void> {
    try {
      if (!this.checkMetamaskAvailability()) {
        throw new Error('Error: Metamask is not available');
      }

      this._ready = true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async switchNetwork(name: ChainName): Promise<void> {
    try {
      if (!this._ready) {
        await this.initAdapter();
      }

      console.log('Adapter: switchNetwork()');
      console.log('Adapter: switchNetwork(): name: ', name);

      const network = networks[name];

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: network.chainId,
                  chainName: network.chainName,
                  rpcUrls: ['https://...'],
                },
              ],
            });
          } catch (addError) {
            console.log(addError);
          }
        }
        // handle other "switch" errors
        console.log(switchError);
      }

      this._network = network;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public get network(): Network {
    return this._network;
  }

  public get name(): AdapterName {
    return this._name;
  }

  public async getTokens(): Promise<Token[]> {
    console.log(`[dfp][adapter][getTokens] getTokens()`);
    try {
      if (!this._ready) {
        await this.initAdapter();
      }

      const [wallet] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!wallet || wallet === '') {
        throw new Error('Metamask: not wallet address found');
      }

      if (!this._network) {
        throw new Error('Adapter: network is not defined');
      }

      const response = await fetch(
        `${this._apiURL}/api/v1/tokens/${wallet}?network=${this._network.chainName}`,
      );
      const {
        data: { tokens },
      }: { data: { tokens: Token[] } } = await response.json();

      console.log(`[dfp][adapter][getTokens] getTokens(): `, tokens);

      return tokens;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getNativeToken(): Promise<Token> {
    console.log(`[dfp][adapter][getNativeToken] getNativeToken()`);
    try {
      if (!this._ready) {
        await this.initAdapter();
      }

      const [wallet] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!wallet || wallet === '') {
        throw new Error('Metamask: not wallet address found');
      }

      if (!this._network) {
        throw new Error('Adapter: network is not defined');
      }

      const response = await fetch(
        `${this._apiURL}/api/v1/native-token/${wallet}?network=${this._network.chainName}`,
      );
      const {
        data: { token },
      }: { data: { token: Token } } = await response.json();

      console.log(`[dfp][adapter][getNativeToken] getNativeToken(): `, token);

      return token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public isAuthenticated(): boolean {
    return !this._profile ? false : true;
  }

  public async login(signMessage: string): Promise<Profile> {
    console.log(`[dfp][adapter][login] login()`);
    try {
      if (!this._ready) {
        await this.initAdapter();
      }

      const [wallet] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!wallet || wallet === '') {
        throw new Error('Metamask: not wallet address found');
      }

      if (!this._network) {
        throw new Error('Adapter: network is not defined');
      }

      const response = await fetch(
        `${this._apiURL}/api/v1/wallets/${wallet}/login?network=${this._network.chainName}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      );

      const { data }: { data: Profile } = await response.json();
      this._profile = data;

      console.log(`[dfp][adapter][login] login(): profile: `, this._profile);

      return this._profile;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    this._profile = undefined!;
    this._ready = false;

    return;
  }

  public async getProfile(): Promise<Profile> {
    if (!this._profile) {
      throw new Error('Adapter: profile is not defined');
    }

    return this._profile;
  }

  public async getUsers(): Promise<number> {
    console.log(`[dfp][adapter][getUsers] getUsers()`);
    try {
      if (!this._ready) {
        await this.initAdapter();
      }

      const response = await fetch(
        `${this._apiURL}/api/v1/wallets?network=${this._network.chainName}`,
      );

      const { meta }: { meta: { count: number } } = await response.json();

      console.log(`[dfp][adapter][getUsers] getUsers(): ${meta.count}`);

      return meta?.count;
    } catch (err) {
      console.log('Adapter: Error getUsers()');
      console.log(err);
      throw err;
    }
  }

  public async getDeposits(): Promise<Deposit[]> {
    // TODO: implement get deposits from API
    const deposits: Deposit[] = [
      {
        amount: 100,
        timestamp: 10000,
      },
      {
        amount: 300,
        timestamp: 1000000,
      },
    ];
    return deposits;

    // try {
    //   if (!this._ready) {
    //     await this.initAdapter();
    //   }
    //   const profile = await this.getProfile();
    //   const q = new Moralis.Query('DepositEventssss');
    //   q.equalTo('userAddr', profile.address);
    //   const results = await q.find();
    //   return results.map((res) => {
    //     const timestamp = new Date(res.get('block_timestamp')).getTime();
    //     return {
    //       amount: Number(res.get('amount')),
    //       timestamp,
    //     };
    //   });
    // } catch (err) {
    //   console.log('entro en el error');
    //   console.log(err);
    //   throw err;
    // }
  }

  public async getWithdrawals(): Promise<Withdraw[]> {
    return [];

    // try {
    //   if (!this._ready) {
    //     await this.initAdapter();
    //   }
    //   const profile = await this.getProfile();
    //   const q = new Moralis.Query('WithdrawEventssss');
    //   q.equalTo('userAddr', profile.address);
    //   const results = await q.find();
    //   return results.map((res) => {
    //     const timestamp = new Date(res.get('block_timestamp')).getTime();
    //     return {
    //       amount: Number(res.get('amount')),
    //       timestamp,
    //     };
    //   });
    // } catch (err) {
    //   console.log('entro en el error');
    //   console.log(err);
    //   throw err;
    // }
  }

  public async approveDeposit(
    amount: number,
    symbol: TokenSymbol,
  ): Promise<Deposit> {
    return {} as Deposit;

    // // validate inputs
    // const { balance } = await this.getNativeToken();
    // if (amount < 0 || amount > balance!) {
    //   throw new Error('invalid amount');
    // }
    // // get token address
    // const tokenAddr = tokens[this.network.chainName][symbol].address;
    // // prepare provider
    // const provider = await Moralis.enableWeb3();
    // const ethers = Moralis.web3Library;
    // const signer = provider.getSigner();
    // // prepare weth contract
    // const wrapContract = new ethers.Contract(
    //   tokenAddr,
    //   IWETH__factory.abi,
    //   signer,
    // ) as IWETH;
    // console.log(1111111);
    // console.log(1111111);
    // console.log(1111111);
    // console.log(1111111);
    // console.log(1111111, tokenAddr);
    // // get strategy address
    // const contractAddr = this.network.strategies['recursive_farming'].address;
    // // parse amount to bignumber
    // const parsedAmount = ethers.utils.parseEther(amount.toString());
    // // make approve weth contract to strategy addres
    // const tx = await wrapContract.approve(contractAddr, parsedAmount);
    // console.log(222222);
    // console.log(222222);
    // console.log(222222);
    // console.log(222222);
    // console.log(222222, contractAddr, parsedAmount);
    // return {
    //   amount,
    //   timestamp: new Date().getTime(),
    //   approveTx: tx,
    // };
  }

  public async approveDepositAave(amount: number): Promise<any> {
    console.log('');
    console.log(
      `[dfp][adapter][approveDepositAave] approveDepositAave(amount: number)`,
    );
    console.log(`[dfp][adapter][approveDepositAave] amount: ${amount}`);

    // validate inputs
    const { balance } = await this.getNativeToken();

    // format amount and balance
    const balanceFormated = ethers.utils.parseEther(balance);
    const amountFormated = ethers.utils.parseEther(amount.toString());

    if (amountFormated.isZero() || amountFormated.gt(balanceFormated)) {
      throw new Error('invalid amount');
    }

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-aave',
    ) as SupplyAaveStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    console.log(
      `[dfp][adapter][approveDepositAave] networkName: ${networkName}`,
    );

    console.log(
      `[dfp][adapter][approveDepositAave] amountFormated: ${amountFormated}`,
    );

    console.log(
      `[dfp][adapter][approveDepositAave] balanceFormated: ${balanceFormated}`,
    );

    console.log(
      `[dfp][adapter][approveDepositAave] contractAddress: ${strategy.contract}`,
    );

    console.log(
      `[dfp][adapter][approveDepositAave] tokenAddress: ${strategy.data.token.address}`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const token = new ethers.Contract(
        strategy.data.token.address,
        ERC20__factory.abi,
        signer,
      );

      try {
        console.log(`[dfp][adapter][approveDepositAave] signer: `);
        console.log(signer);

        const userAddress = await signer.getAddress();

        console.log(
          `[dfp][adapter][approveDepositAave] userAddress: ${userAddress}`,
        );

        const transaction = await token
          .connect(signer)
          .approve(strategy.contract, amountFormated);

        return transaction;
      } catch (error) {
        console.log(`[dfp][adapter][approveDepositAave] error: ${error}`);
        throw error;
      }
    }

    return;
  }

  public async depositAave(amount: number): Promise<any> {
    console.log('');
    console.log(`[dfp][adapter][depositAave] depositAave(amount: number)`);
    console.log(`[dfp][adapter][depositAave] amount: ${amount}`);

    // validate inputs
    const { balance } = await this.getNativeToken();

    // format amount and balance
    const balanceFormated = ethers.utils.parseEther(balance);
    const amountFormated = ethers.utils.parseEther(amount.toString());

    if (amountFormated.isZero() || amountFormated.gt(balanceFormated)) {
      throw new Error('invalid amount');
    }

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-aave',
    ) as SupplyAaveStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    console.log(`[dfp][adapter][depositAave] networkName: ${networkName}`);

    console.log(
      `[dfp][adapter][depositAave] amountFormated: ${amountFormated}`,
    );

    console.log(
      `[dfp][adapter][depositAave] balanceFormated: ${balanceFormated}`,
    );

    console.log(
      `[dfp][adapter][depositAave] contractAddress: ${strategy.contract}`,
    );

    console.log(
      `[dfp][adapter][depositAave] tokenAddress: ${strategy.data.token.address}`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      console.log(`[dfp][adapter][depositAave] signer: `);
      console.log(signer);

      const userAddress = await signer.getAddress();

      console.log(`[dfp][adapter][depositAave] userAddress: ${userAddress}`);

      const supplyAaveContract = new ethers.Contract(
        strategy.contract,
        SupplyAave__factory.abi,
        signer,
      );

      const GAS_LIMIT = BigNumber.from('2074000');

      try {
        const supplyTx = await supplyAaveContract.deposit(
          strategy.data.token.address,
          amountFormated,
          {
            gasLimit: GAS_LIMIT,
          },
        );

        return supplyTx;
      } catch (error) {
        console.log(error);
      }
    }

    return;
  }

  public async getBalanceAave(): Promise<number> {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      // get token address and contract from API
      const response = await fetch(
        `${this._apiURL}/api/v1/strategies-by-networks`,
      );

      const {
        data,
      }: {
        data: {
          strategies: { [key: string]: DFPStrategy[] };
        };
      } = await response.json();

      const networkName = this._network.chainName;

      const strategy = data.strategies[networkName].find(
        (strategy) => strategy.type === 'supply-aave',
      ) as SupplyAaveStrategy;

      if (!strategy) {
        throw new Error('strategy not found');
      }

      const supplyAaveContract = new ethers.Contract(
        strategy.contract,
        SupplyAave__factory.abi,
        signer,
      );

      try {
        const balance = await supplyAaveContract
          .connect(provider)
          .balances(this._profile.address);

        return parseFloat(ethers.utils.formatEther(balance));
      } catch (error) {
        console.log(error);
      }
    }

    return 0;
  }

  public async withdrawAave(amount: number): Promise<any> {
    console.log('');
    console.log(`[dfp][adapter][withdrawAave] withdrawAave(amount: number)`);
    console.log(`[dfp][adapter][withdrawAave] amount: ${amount}`);
    // validate inputs
    const balance = await this.getBalanceAave();

    // format amount and balance
    const balanceFormated = ethers.utils.parseEther(balance.toString());
    const amountFormated = ethers.utils.parseEther(amount.toString());

    if (amountFormated.isZero() || amountFormated.gt(balanceFormated)) {
      throw new Error('invalid amount');
    }

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-aave',
    ) as SupplyAaveStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    console.log(`[dfp][adapter][withdrawAave] networkName: ${networkName}`);

    console.log(
      `[dfp][adapter][withdrawAave] amountFormated: ${amountFormated}`,
    );

    console.log(
      `[dfp][adapter][withdrawAave] balanceFormated: ${balanceFormated}`,
    );

    console.log(
      `[dfp][adapter][withdrawAave] contractAddress: ${strategy.contract}`,
    );

    console.log(
      `[dfp][adapter][withdrawAave] tokenAddress: ${strategy.data.token.address}`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      console.log(`[dfp][adapter][withdrawAave] signer: `);
      console.log(signer);

      const userAddress = await signer.getAddress();

      console.log(`[dfp][adapter][withdrawAave] userAddress: ${userAddress}`);

      const supplyAaveContract = new ethers.Contract(
        strategy.contract,
        SupplyAave__factory.abi,
        signer,
      );

      const GAS_LIMIT = BigNumber.from('2074000');

      try {
        const supplyTx = await supplyAaveContract.withdraw(
          strategy.data.token.address,
          amountFormated,
          {
            gasLimit: GAS_LIMIT,
          },
        );

        return supplyTx;
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async approveDepositUniswap(
    amount: number,
    symbol: TokenSymbol,
  ): Promise<any> {
    console.log('');
    console.log(
      `[dfp][adapter][approveDepositUniswap] approveDepositUniswap(amount: number)`,
    );
    console.log(`[dfp][adapter][approveDepositUniswap] amount: ${amount}`);

    // validate inputs
    const { balance } = await this.getNativeToken();

    // format amount and balance
    const balanceFormated = ethers.utils.parseEther(balance);
    const amountFormated = ethers.utils.parseEther(amount.toString());

    if (amountFormated.isZero() || amountFormated.gt(balanceFormated)) {
      throw new Error('invalid amount');
    }

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-uniswap',
    ) as SupplyUniswapStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    const tokens = [strategy.data.token0, strategy.data.token1];

    const tokenFounded = tokens.find((token) => token.symbol === symbol);

    console.log(
      `[dfp][adapter][approveDepositUniswap] networkName: ${networkName}`,
    );

    console.log(
      `[dfp][adapter][approveDepositUniswap] amountFormated: ${amountFormated}`,
    );

    console.log(
      `[dfp][adapter][approveDepositUniswap] balanceFormated: ${balanceFormated}`,
    );

    console.log(
      `[dfp][adapter][approveDepositUniswap] contractAddress: ${strategy.contract}`,
    );

    console.log(
      `[dfp][adapter][approveDepositUniswap] tokenAddress: ${
        tokenFounded!.address
      }`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const token = new ethers.Contract(
        tokenFounded!.address,
        ERC20__factory.abi,
        signer,
      );

      try {
        console.log(`[dfp][adapter][approveDepositUniswap] signer: `);
        console.log(signer);

        const userAddress = await signer.getAddress();

        console.log(
          `[dfp][adapter][approveDepositUniswap] userAddress: ${userAddress}`,
        );

        const transaction = await token
          .connect(signer)
          .approve(strategy.contract, amountFormated);

        return transaction;
      } catch (error) {
        console.log(`[dfp][adapter][approveDepositUniswap] error: ${error}`);
        throw error;
      }
    }

    return;
  }

  public async deposit(deposit: Deposit): Promise<Deposit> {
    return {} as Deposit;
  }

  public async mintNewPosition(amount1: number, amount2: number): Promise<any> {
    console.log('');
    console.log(
      `[dfp][adapter][mintNewPosition] mintNewPosition(amount1: number, amount2: number)`,
    );
    console.log(`[dfp][adapter][mintNewPosition] amount1: ${amount1}`);
    console.log(`[dfp][adapter][mintNewPosition] amount2: ${amount2}`);

    const amount1Formated = ethers.utils.parseEther(amount1.toString());

    const amount2Formated = ethers.utils.parseEther(amount2.toString());

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-uniswap',
    ) as SupplyUniswapStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    console.log(`[dfp][adapter][mintNewPosition] networkName: ${networkName}`);

    console.log(
      `[dfp][adapter][mintNewPosition] amount1Formated: ${amount1Formated}`,
    );

    console.log(
      `[dfp][adapter][mintNewPosition] amount2Formated: ${amount2Formated}`,
    );

    console.log(
      `[dfp][adapter][mintNewPosition] contractAddress: ${strategy.contract}`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      console.log(`[dfp][adapter][mintNewPosition] signer: `);
      console.log(signer);

      const userAddress = await signer.getAddress();

      console.log(
        `[dfp][adapter][mintNewPosition] userAddress: ${userAddress}`,
      );

      const supplyUniContract = new ethers.Contract(
        strategy.contract,
        SupplyUni__factory.abi,
        signer,
      );

      const GAS_LIMIT = BigNumber.from('2074000');

      try {
        const supplyTx = await supplyUniContract.mintNewPosition(
          strategy.data.poolId,
          amount1Formated,
          amount2Formated,
          BigNumber.from(100),
          {
            gasLimit: GAS_LIMIT,
          },
        );

        return supplyTx;
      } catch (error) {
        console.log(`[dfp][adapter][mintNewPosition] error: ${error}`);
        console.log(error);
      }
    }
  }

  public async getBalanceUniswap(): Promise<UniswapPosition> {
    console.log('');
    console.log(`[dfp][adapter][getBalanceUni] getBalanceUni()`);

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      // get token address and contract from API
      const response = await fetch(
        `${this._apiURL}/api/v1/strategies-by-networks`,
      );

      const {
        data,
      }: {
        data: {
          strategies: { [key: string]: DFPStrategy[] };
        };
      } = await response.json();

      const networkName = this._network.chainName;

      const strategy = data.strategies[networkName].find(
        (strategy) => strategy.type === 'supply-uniswap',
      ) as SupplyUniswapStrategy;

      if (!strategy) {
        throw new Error('strategy not found from API in this network');
      }

      console.log(`[dfp][adapter][getBalanceUni] networkName: ${networkName}`);

      console.log(
        `[dfp][adapter][getBalanceUni] contractAddress: ${strategy.contract}`,
      );

      const poolId = strategy.data.poolId;

      console.log(`[dfp][adapter][getBalanceUni] poolId: ${poolId}`);

      const supplyUniContract = new ethers.Contract(
        strategy.contract,
        SupplyUni__factory.abi,
        signer,
      );

      try {
        const balance = await supplyUniContract
          .connect(provider)
          .getOwnerInfo(this._profile.address, poolId);

        console.log(
          `[dfp][adapter][getBalanceUni] tuple: ${ethers.utils.formatEther(
            balance[0],
          )}`,
        );

        console.log(
          `[dfp][adapter][getBalanceUni] totalSupply: ${ethers.utils.formatEther(
            balance[1],
          )}`,
        );

        console.log(
          `[dfp][adapter][getBalanceUni] token1: ${ethers.utils.formatEther(
            balance[2],
          )}`,
        );

        console.log(
          `[dfp][adapter][getBalanceUni] token2: ${ethers.utils.formatEther(
            balance[3],
          )}`,
        );

        const uniswapPosition: UniswapPosition = {
          poolId: poolId,
          tuple: ethers.utils.formatEther(balance[0]),
          totalSupply: ethers.utils.formatEther(balance[1]),
          token0: ethers.utils.formatEther(balance[2]),
          token1: ethers.utils.formatEther(balance[3]),
        };

        return uniswapPosition;
      } catch (error) {
        console.log(error);
      }
    }

    return {} as UniswapPosition;
  }

  public async increasePosition(
    amount1: number,
    amount2: number,
  ): Promise<any> {
    console.log('');
    console.log(
      `[dfp][adapter][increasePosition] increasePosition(amount1: number, amount2: number)`,
    );
    console.log(`[dfp][adapter][increasePosition] amount1: ${amount1}`);
    console.log(`[dfp][adapter][increasePosition] amount2: ${amount2}`);

    const amount1Formated = ethers.utils.parseEther(amount1.toString());

    const amount2Formated = ethers.utils.parseEther(amount2.toString());

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-uniswap',
    ) as SupplyUniswapStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    console.log(`[dfp][adapter][increasePosition] networkName: ${networkName}`);

    console.log(
      `[dfp][adapter][increasePosition] amount1Formated: ${amount1Formated}`,
    );

    console.log(
      `[dfp][adapter][increasePosition] amount2Formated: ${amount2Formated}`,
    );

    console.log(
      `[dfp][adapter][increasePosition] contractAddress: ${strategy.contract}`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      console.log(`[dfp][adapter][increasePosition] signer: `);
      console.log(signer);

      const userAddress = await signer.getAddress();

      console.log(
        `[dfp][adapter][increasePosition] userAddress: ${userAddress}`,
      );

      const supplyUniContract = new ethers.Contract(
        strategy.contract,
        SupplyUni__factory.abi,
        signer,
      );

      const GAS_LIMIT = BigNumber.from('2074000');

      try {
        const supplyTx = await supplyUniContract.increasePosition(
          strategy.data.poolId,
          amount1Formated,
          amount2Formated,
          BigNumber.from(100),
          {
            gasLimit: GAS_LIMIT,
          },
        );

        return supplyTx;
      } catch (error) {
        console.log(`[dfp][adapter][increasePosition] error: ${error}`);
        console.log(error);
      }
    }
  }

  public async decreasePosition(
    poolId: number,
    percentage: number,
    maxSlip: number,
  ): Promise<any> {
    console.log('');
    console.log(
      `[dfp][adapter][decreasePosition] decreasePosition(poolId: string, percentage: number, maxSlip: number)`,
    );

    console.log(`[dfp][adapter][decreasePosition] poolId: ${poolId}`);

    console.log(`[dfp][adapter][decreasePosition] percentage: ${percentage}`);

    console.log(`[dfp][adapter][decreasePosition] maxSlip: ${maxSlip}`);

    // get token address and contract from API
    const response = await fetch(
      `${this._apiURL}/api/v1/strategies-by-networks`,
    );

    const {
      data,
    }: {
      data: {
        strategies: { [key: string]: DFPStrategy[] };
      };
    } = await response.json();

    const networkName = this._network.chainName;

    const strategy = data.strategies[networkName].find(
      (strategy) => strategy.type === 'supply-uniswap',
    ) as SupplyUniswapStrategy;

    if (!strategy) {
      throw new Error('strategy not found');
    }

    console.log(`[dfp][adapter][decreasePosition] networkName: ${networkName}`);

    console.log(
      `[dfp][adapter][decreasePosition] contractAddress: ${strategy.contract}`,
    );

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      console.log(`[dfp][adapter][decreasePosition] signer: `);

      console.log(signer);

      const userAddress = await signer.getAddress();

      console.log(
        `[dfp][adapter][decreasePosition] userAddress: ${userAddress}`,
      );

      const supplyUniContract = new ethers.Contract(
        strategy.contract,
        SupplyUni__factory.abi,
        signer,
      );

      const GAS_LIMIT = BigNumber.from('2074000');

      try {
        const supplyTx = await supplyUniContract.decreasePosition(
          strategy.data.poolId,
          percentage,
          maxSlip,
          {
            gasLimit: GAS_LIMIT,
          },
        );

        return supplyTx;
      } catch (error) {
        console.log(`[dfp][adapter][decreasePosition] error: ${error}`);
        console.log(error);
      }
    }
  }

  public async listStrategies(): Promise<DFPStrategy[]> {
    try {
      const response = await fetch(`${this._apiURL}/api/v1/strategies`);
      const {
        data,
      }: {
        data: {
          strategies: DFPStrategy[];
        };
      } = await response.json();

      return data?.strategies;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async listStrategiesByNetworks(): Promise<StrategiesByNetworks> {
    try {
      const response = await fetch(
        `${this._apiURL}/api/v1/strategies-by-networks`,
      );
      const {
        data,
      }: {
        data: {
          strategies: {
            [key: string]: DFPStrategy[];
          };
        };
      } = await response.json();

      return data?.strategies;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
