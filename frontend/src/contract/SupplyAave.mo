import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor SupplyAave {
    type Token = actor {
        transferFrom: shared (from: Principal, to: Principal, amount: Nat) -> async Bool;
        balanceOf: shared (who: Principal) -> async Nat;
    };
    
    type Pool = actor {
        supply: shared (tokenAddr: Principal, amount: Nat, to: Principal) -> async ();
        withdraw: shared (tokenAddr: Principal, amount: Nat, to: Principal) -> async ();
    };

    let pool: Pool = {};
    var balances: [Principal:Nat] = {}; 

    // Deposit function
    public shared (caller) func deposit(tokenAddr: Principal, amount: Nat) : async () {
        let token = actor(tokenAddr) as Token;
        balances[caller] := (balances[caller] ?? 0) + amount;
        await token.transferFrom(caller, Principal.fromActor(this), amount);
        await pool.supply(tokenAddr, amount, caller);
    }

    // Withdraw function
    public shared (caller) func withdraw(tokenAddr: Principal, amount: Nat) : async () {
        balances[caller] := (balances[caller] ?? 0) - amount;
        await pool.withdraw(tokenAddr, amount, caller);
        let token = actor(tokenAddr) as Token;
        await token.transferFrom(Principal.fromActor(this), caller, amount);
    }
}
