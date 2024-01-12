import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor interface IWETH {
    type Result = variant { Ok: Nat; Err: Text };
    type TransferResult = variant { Success: Bool; Err: Text };

    deposit: shared (amount: Nat) -> async Result;

    withdraw: shared (amount: Nat) -> async Result;

    totalSupply: query () -> async Nat;

    balanceOf: query (account: Principal) -> async Nat;

    transfer: shared (recipient: Principal, amount: Nat) -> async TransferResult;

    allowance: query (owner: Principal, spender: Principal) -> async Nat;

    approve: shared (spender: Principal, amount: Nat) -> async TransferResult;

    transferFrom: shared (sender: Principal, recipient: Principal, amount: Nat) -> async TransferResult;

    event Approval(owner: Principal, spender: Principal, amount: Nat);

    event Transfer(from: Principal, to: Principal, amount: Nat);
};