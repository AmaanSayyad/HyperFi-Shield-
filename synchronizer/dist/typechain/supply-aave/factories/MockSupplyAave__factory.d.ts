import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockSupplyAave, MockSupplyAaveInterface } from "../MockSupplyAave";
export declare class MockSupplyAave__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<MockSupplyAave>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): MockSupplyAave;
    connect(signer: Signer): MockSupplyAave__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506101dd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e1a7d4d1461003b578063b6b55f2514610057575b600080fd5b61005560048036038101906100509190610150565b610073565b005b610071600480360381019061006c9190610150565b6100c4565b005b3373ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364826040516100b9919061018c565b60405180910390a250565b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c8260405161010a919061018c565b60405180910390a250565b600080fd5b6000819050919050565b61012d8161011a565b811461013857600080fd5b50565b60008135905061014a81610124565b92915050565b60006020828403121561016657610165610115565b5b60006101748482850161013b565b91505092915050565b6101868161011a565b82525050565b60006020820190506101a1600083018461017d565b9291505056fea264697066735822122045064187ec2e77ce28a690bc5a6b93992f352ec46da4a3b5eb81cfad57d0d18964736f6c634300080a0033";
    static readonly abi: ({
        inputs: never[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): MockSupplyAaveInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockSupplyAave;
}
