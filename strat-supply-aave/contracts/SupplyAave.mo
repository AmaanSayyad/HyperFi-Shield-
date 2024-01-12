import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor SupplyAave {
    // Constants
    let AAVE_REF_CODE : Nat16 = 0;

    // State
    var balances : [var (Principal, Nat)] = [];

    // Internal functions
    private func findBalanceIndex(user: Principal): ?Nat {
        for (i, (principal, _)) in balances.entries() {
            if (principal == user) {
                return ? i;
            };
        };
        return null;
    }

    private func getBalance(user: Principal): Nat {
        let idx = findBalanceIndex(user);
        switch (idx) {
            case (? i) => balances[i].1;
            case null => 0;
        };
    }

    private func setBalance(user: Principal, amount: Nat): () {
        let idx = findBalanceIndex(user);
        switch (idx) {
            case (? i) => balances[i].1 := amount;
            case null => balances := Array.append<Nat>(balances, (user, amount));
        };
    }

    // Deposit tokens (conceptual)
    public func deposit(tokenAddr: Principal, amount: Nat): async () {
        assert(amount > 0, "Amount cannot be zero");

        let currentBalance = getBalance(caller);
        setBalance(caller, currentBalance + amount);

    }

    // Withdraw tokens (conceptual)
    public func withdraw(tokenAddr: Principal, amount: Nat): async () {
        assert(amount > 0, "Amount cannot be zero");

        let currentBalance = getBalance(caller);
        assert(currentBalance >= amount, "Not enough balance");

        setBalance(caller, currentBalance - amount);

    }

    public query func getBalance(user: Principal): async Nat {
        return getBalance(user);
    }
}