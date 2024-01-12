/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  SupplyAave,
  SupplyAaveInterface,
} from "../../contracts/SupplyAave";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "aavePool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Error__AmountIsZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
    ],
    name: "Error__NotEnoughAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
    ],
    name: "Error__NotEnoughBalance",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "AAVE_REF_CODE",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pool",
    outputs: [
      {
        internalType: "contract IPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051610efc380380610efc833981810160405281019061003291906100cf565b8073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1681525050506100fc565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061009c82610071565b9050919050565b6100ac81610091565b81146100b757600080fd5b50565b6000815190506100c9816100a3565b92915050565b6000602082840312156100e5576100e461006c565b5b60006100f3848285016100ba565b91505092915050565b608051610dd061012c6000396000818161010201528181610578015281816105fb015261080e0152610dd06000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806316f0115b1461005c57806327e235e31461007a57806347e7ef24146100aa5780635ee143c2146100c6578063f3fef3a3146100e4575b600080fd5b610064610100565b604051610071919061097f565b60405180910390f35b610094600480360381019061008f91906109dd565b610124565b6040516100a19190610a23565b60405180910390f35b6100c460048036038101906100bf9190610a6a565b61013c565b005b6100ce6106df565b6040516100db9190610ac7565b60405180910390f35b6100fe60048036038101906100f99190610a6a565b6106e4565b005b7f000000000000000000000000000000000000000000000000000000000000000081565b60006020528060005260406000206000915090505481565b806000811415610178576040517f7a65145500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600083905060008173ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b81526004016101ba929190610af1565b602060405180830381865afa1580156101d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101fb9190610b2f565b14806102815750828173ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b815260040161023e929190610af1565b602060405180830381865afa15801561025b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061027f9190610b2f565b105b15610340578073ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b81526004016102c1929190610af1565b602060405180830381865afa1580156102de573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103029190610b2f565b836040517f36260e9e000000000000000000000000000000000000000000000000000000008152600401610337929190610b5c565b60405180910390fd5b828173ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b815260040161037a9190610b85565b602060405180830381865afa158015610397573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103bb9190610b2f565b10806103c75750600083145b15610484578073ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b81526004016104059190610b85565b602060405180830381865afa158015610422573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104469190610b2f565b836040517f71b6c38100000000000000000000000000000000000000000000000000000000815260040161047b929190610b5c565b60405180910390fd5b826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104d29190610bcf565b925050819055508073ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b815260040161051693929190610c25565b6020604051808303816000875af1158015610535573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105599190610c94565b508073ffffffffffffffffffffffffffffffffffffffff1663095ea7b37f0000000000000000000000000000000000000000000000000000000000000000856040518363ffffffff1660e01b81526004016105b5929190610cc1565b6020604051808303816000875af11580156105d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105f89190610c94565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663617ba03785853060006040518563ffffffff1660e01b81526004016106599493929190610cea565b600060405180830381600087803b15801561067357600080fd5b505af1158015610687573d6000803e3d6000fd5b505050503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c846040516106d19190610a23565b60405180910390a250505050565b600081565b6000829050816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410806107355750600082145b156107b7576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054826040517f71b6c3810000000000000000000000000000000000000000000000000000000081526004016107ae929190610b5c565b60405180910390fd5b816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108059190610d2f565b925050819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166369328dec8284336040518463ffffffff1660e01b815260040161086993929190610d63565b6020604051808303816000875af1158015610888573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ac9190610b2f565b503373ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364836040516108f39190610a23565b60405180910390a2505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061094561094061093b84610900565b610920565b610900565b9050919050565b60006109578261092a565b9050919050565b60006109698261094c565b9050919050565b6109798161095e565b82525050565b60006020820190506109946000830184610970565b92915050565b600080fd5b60006109aa82610900565b9050919050565b6109ba8161099f565b81146109c557600080fd5b50565b6000813590506109d7816109b1565b92915050565b6000602082840312156109f3576109f261099a565b5b6000610a01848285016109c8565b91505092915050565b6000819050919050565b610a1d81610a0a565b82525050565b6000602082019050610a386000830184610a14565b92915050565b610a4781610a0a565b8114610a5257600080fd5b50565b600081359050610a6481610a3e565b92915050565b60008060408385031215610a8157610a8061099a565b5b6000610a8f858286016109c8565b9250506020610aa085828601610a55565b9150509250929050565b600061ffff82169050919050565b610ac181610aaa565b82525050565b6000602082019050610adc6000830184610ab8565b92915050565b610aeb8161099f565b82525050565b6000604082019050610b066000830185610ae2565b610b136020830184610ae2565b9392505050565b600081519050610b2981610a3e565b92915050565b600060208284031215610b4557610b4461099a565b5b6000610b5384828501610b1a565b91505092915050565b6000604082019050610b716000830185610a14565b610b7e6020830184610a14565b9392505050565b6000602082019050610b9a6000830184610ae2565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610bda82610a0a565b9150610be583610a0a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610c1a57610c19610ba0565b5b828201905092915050565b6000606082019050610c3a6000830186610ae2565b610c476020830185610ae2565b610c546040830184610a14565b949350505050565b60008115159050919050565b610c7181610c5c565b8114610c7c57600080fd5b50565b600081519050610c8e81610c68565b92915050565b600060208284031215610caa57610ca961099a565b5b6000610cb884828501610c7f565b91505092915050565b6000604082019050610cd66000830185610ae2565b610ce36020830184610a14565b9392505050565b6000608082019050610cff6000830187610ae2565b610d0c6020830186610a14565b610d196040830185610ae2565b610d266060830184610ab8565b95945050505050565b6000610d3a82610a0a565b9150610d4583610a0a565b925082821015610d5857610d57610ba0565b5b828203905092915050565b6000606082019050610d786000830186610ae2565b610d856020830185610a14565b610d926040830184610ae2565b94935050505056fea2646970667358221220779714dbbad7d56f03666ce3482a56c08b729d392e3b2b317b663080a9acfd4064736f6c634300080a0033";

type SupplyAaveConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SupplyAaveConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SupplyAave__factory extends ContractFactory {
  constructor(...args: SupplyAaveConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    aavePool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SupplyAave> {
    return super.deploy(aavePool, overrides || {}) as Promise<SupplyAave>;
  }
  override getDeployTransaction(
    aavePool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(aavePool, overrides || {});
  }
  override attach(address: string): SupplyAave {
    return super.attach(address) as SupplyAave;
  }
  override connect(signer: Signer): SupplyAave__factory {
    return super.connect(signer) as SupplyAave__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SupplyAaveInterface {
    return new utils.Interface(_abi) as SupplyAaveInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SupplyAave {
    return new Contract(address, _abi, signerOrProvider) as SupplyAave;
  }
}
