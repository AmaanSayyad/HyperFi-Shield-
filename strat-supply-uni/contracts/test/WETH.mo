import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor WETH9 {
    let name: Text = "Wrapped Ether";
    let symbol: Text = "WETH";
    let decimals: Nat8 = 18;

    var balanceOf: [var (Principal, Nat)] := [];
    var allowance: [var (Principal, [(Principal, Nat)])] := [];

    // Helper function to find balance index
    private func findBalanceIndex(user: Principal): ?Nat {
        for (i, (principal, _)) in balanceOf.entries() {
            if (principal == user) {
                return ? i;
            };
        };
        return null;
    }

    // Helper function to find allowance index
    private func findAllowanceIndex(owner: Principal, spender: Principal): ?Nat {
        for (i, (ownerPrin, spenders)) in allowance.entries() {
            if (ownerPrin == owner) {
                for (j, (spenderPrin, _)) in spenders.entries() {
                    if (spenderPrin == spender) {
                        return ? j;
                    };
                };
            };
        };
        return null;
    }

    // Function to handle deposit-like logic
    public func deposit(user: Principal, amount: Nat) : async {
        let idx = findBalanceIndex(user);
        switch (idx) {
            case (? i) => balanceOf[i].1 += amount;
            case null => balanceOf := Array.append<Nat>(balanceOf, (user, amount));
        };
    }

    // Function to handle withdraw-like logic
    public func withdraw(user: Principal, amount: Nat) : async {
        let idx = findBalanceIndex(user);
        switch (idx) {
            case (? i) => {
                assert(balanceOf[i].1 >= amount, "Insufficient balance");
                balanceOf[i].1 -= amount;
            };
            case null => assert(false, "User has no balance");
        };
    }

    // Function to get total supply
    public query func totalSupply() : async Nat {
        return balanceOf.fold((0, (_, amount) => amount), 0);
    }

    // Function to approve
    public func approve(owner: Principal, spender: Principal, amount: Nat) : async Bool {
        let idx = findAllowanceIndex(owner, spender);
        switch (idx) {
            case (? i) => allowance[i].1.1 := amount;
            case null => allowance := Array.append<(Principal, [(Principal, Nat)])>(allowance, (owner, [(spender, amount)]));
        };
        return true;
    }

    // Function to transfer
    public func transfer(from: Principal, to: Principal, amount: Nat) : async Bool {
        return await transferFrom(from, from, to, amount);
    }

    // Function to transfer from
    public func transferFrom(owner: Principal, from: Principal, to: Principal, amount: Nat) : async Bool {
        let ownerIdx = findBalanceIndex(owner);
        let fromIdx = findBalanceIndex(from);
        let toIdx = findBalanceIndex(to);

        switch (ownerIdx, fromIdx, toIdx) {
            case (? ownerIndex, ? fromIndex, ? toIndex) => {
                assert(balanceOf[fromIndex].1 >= amount, "Insufficient balance");

                balanceOf[fromIndex].1 -= amount;
                balanceOf[toIndex].1 += amount;

                let allowanceIdx = findAllowanceIndex(owner, from);
                switch (allowanceIdx) {
                    case (? allowanceIndex) => {
                        assert(allowance[allowanceIndex].1[0].1 >= amount, "Insufficient allowance");

                        allowance[allowanceIndex].1[0].1 -= amount;
                    };
                    case null => assert(false, "No allowance found");
                };
            };
            case (_, _, _) => assert(false, "Invalid addresses");
        };

        return true;
    }

}