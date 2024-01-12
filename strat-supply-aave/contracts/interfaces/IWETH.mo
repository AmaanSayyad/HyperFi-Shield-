import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor interface IWrappedToken {
    type Balance = Nat;
    type Result = variant { Ok: Balance; Err: Text };

    deposit: shared (amount: Nat) -> async Result;

    withdraw: shared (amount: Nat) -> async Result;

    transfer: shared (to: Principal, amount: Nat) -> async Result;
    balanceOf: query (who: Principal) -> async Nat;

    allowance: query (owner: Principal, spender: Principal) -> async Nat;
    approve: shared (spender: Principal, amount: Nat) -> async Result;
    
    transferFrom: shared (from: Principal, to: Principal, amount: Nat) -> async Result;
    
    totalSupply: query () -> async Nat;
    
    name: query () -> async Text;
    symbol: query () -> async Text;
    decimals: query () -> async Nat;
    
    // Events
    event Transfer(from: Principal, to: Principal, value: Nat);
    event Approval(owner: Principal, spender: Principal, value: Nat);
}