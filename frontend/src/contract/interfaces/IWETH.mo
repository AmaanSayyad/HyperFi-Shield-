import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

type ERC20 = actor {
    transfer: shared (to: Principal, amount: Nat) -> async Bool;
    transferFrom: shared (from: Principal, to: Principal, amount: Nat) -> async Bool;
    balanceOf: shared (who: Principal) -> async Nat;
};

type IWETH = actor {
    transfer: shared (to: Principal, amount: Nat) -> async Bool;
    transferFrom: shared (from: Principal, to: Principal, amount: Nat) -> async Bool;
    balanceOf: shared (who: Principal) -> async Nat;

    allowance: shared (owner: Principal, spender: Principal) -> async Nat;
    approve: shared (spender: Principal, amount: Nat) -> async Bool;
    deposit: shared () -> async ();
    withdraw: shared (amount: Nat) -> async ();
};

actor WETHImpl : IWETH {
    private var balances = {};
    private var allowances = {};
    private var totalSupply = {};

    public shared (caller) func transfer(to: Principal, amount: Nat) : async Bool {
      let callerPrincipal = caller; // Get the caller's principal
      let callerBalance = await self.balanceOf(callerPrincipal); // Get the caller's balance

      if (callerBalance >= amount) {
        // Subtract the amount from the caller's balance
        balances[callerPrincipal] := balances[callerPrincipal] - amount;
        // Add the amount to the recipient's balance
        balances[to] := balances[to] + amount;
        return true;
      } else {
        return false;
      }
    };

    public shared (caller) func transferFrom(from: Principal, to: Principal, amount: Nat) : async Bool {
        // Check if the caller is allowed to spend the specified amount on behalf of 'from'
        if (allowances[from]?.[caller] >= amount) {
            // Check if 'from' has enough balance
            if (balances[from] >= amount) {
                // Decrease 'from' balance
                balances[from] := balances[from] - amount;

                // Increase 'to' balance
                balances[to] := (balances[to] ?? 0) + amount;

                // Decrease the allowance
                allowances[from][caller] := allowances[from][caller] - amount;

                return true;
            }
        }
        return false;
    }

    public shared (caller) func balanceOf(who: Principal) : async Nat {
        return balances[who] ?? 0;
    }

    public shared (caller) func allowance(owner: Principal, spender: Principal) : async Nat {
        return allowances[owner]?.[spender] ?? 0;
    }

    public shared (caller) func approve(spender: Principal, amount: Nat) : async Bool {
        let callerPrincipal = caller; // Get the caller's principal

        // Set the allowance
        allowances[callerPrincipal][spender] := amount;

        return true;
    }

    public shared (caller) func deposit() : async () {
        let callerPrincipal = caller; // Get the caller's principal

        // Simplified logic: Add 1 WETH to the caller's balance
        balances[callerPrincipal] := (balances[callerPrincipal] ?? 0) + 1;

        // Increase the total supply by 1
        totalSupply += 1;

        // In a real-world scenario, you would also handle the transfer of ICP to this contract
    }

    public shared (caller) func withdraw(amount: Nat) : async () {
        let callerPrincipal = caller; // Get the caller's principal
        if ((balances[callerPrincipal] ?? 0) >= amount) {
            balances[callerPrincipal] := balances[callerPrincipal] - amount;
            totalSupply -= amount;
        } else {
            throw "Insufficient balance";
        }
    }
};