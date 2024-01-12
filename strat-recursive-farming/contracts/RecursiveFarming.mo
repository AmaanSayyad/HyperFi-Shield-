import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Token "path_to_token_canister_module";

type TokenCanister = actor {
    transferFrom: (caller: Principal, receiver: Principal, amount: Nat) -> async Bool;
};

actor RecursiveFarming {

    type Error_NotEnoughBalance = { balance: Nat };
    type Error_NotEnoughQuotas = { quotas: Nat, requestedQuotas: Nat };

    type DepositEvent = { depositor: Principal, amount: Nat, quotas: Nat };
    type WithdrawEvent = { withdrawer: Principal, amount: Nat, quotas: Nat };

    private var investmentAmount: Nat = 0;
    private var status: StrategyStatus = #Pristine;
    private var lastTimestamp: Nat = 0;
    private var interval: Nat = 0;
    private var totalInvested: Nat = 0;
    private var tokenAddresses: [Principal] = [];
    private var wavaxTotalSupply: Nat = 0;
    private var quotas: Nat = 0;
    private var gasPriceMultiplier: Nat = 0;
    private var aaveRefCode: Nat16 = 0;
    private var withdrawing: Bool = false;

    type StrategyStatus = {
        #Pristine;
        #Borrow;
        #Supply;
        #Done;
    };

    actor RecursiveFarming {

    private var tokenCanister: TokenCanister = actor "6ceop-cyaaa-aaaah-qaa4q-ca"; 
    private var totalDeposited: Nat = 0;

    public func deposit(_amount: Nat) : async {
        let success = await tokenCanister.transferFrom(Principal.fromActor(this), caller, _amount);
        if (success) {
            totalDeposited += _amount;
        } else {
            throw Error_NotEnoughBalance({ balance = _amount });
        }
    }

    private func _borrow(_borrowAvailable: Nat) : async {
        let borrowResult = await lendingCanister.borrow(caller, _borrowAvailable);
        if (borrowResult.borrowedAmount > 0) {
            totalInvested += borrowResult.borrowedAmount;
            status = #Borrow;
        } else {
            status = #Done;
        }
    }

    private func _supply(_totalBalance: Nat) : async {
        let supplyResult = await lendingCanister.supply(caller, _totalBalance);
        if (supplyResult.suppliedAmount > 0) {
            totalInvested += supplyResult.suppliedAmount;
            status = #Supply;
        } else {
            status = #Done;
        }
    }

    public func checkUpkeep() : async Bool {
        let intervalPassed = Time.now() > (lastUpkeepTime + upkeepInterval);
        let otherCondition = true;
        return intervalPassed and otherCondition;
    }

    public func performUpkeep() : async {
        if (await checkUpkeep()) {
            lastUpkeepTime = Time.now();
            let _totalBalance = await tokenCanister.balanceOf(Principal.fromActor(this));
            let _borrowAvailable = _getQuotaQty(_totalBalance);
            let _amount = _getAmountFromQuotas(_borrowAvailable);
            let _quotas = _getQuotaPrice();
            await _borrow(...);
            await _supply(...);
        } else {
            throw Error_NotEnoughQuotas({ quotas = ... });
        }
    }

    public func requestWithdraw(_amountPercentage: Nat) : async {
        public func requestWithdraw(_amountPercentage: Nat) : async {
        assert(_amountPercentage > 0 and _amountPercentage <= 100, "Invalid percentage");

        let userQuotas = userInvestments[Principal.fromActor(this)];
        let quotasToWithdraw = (_amountPercentage * userQuotas) / 100;

        assert(quotasToWithdraw > 0, "Invalid amount");
        pendingWithdrawals[Principal.fromActor(this)] := Some(quotasToWithdraw);
        }
    }

    public func withdraw(_userAddr: Principal, _amount: Nat) : async {
    public func withdraw(_userAddr: Principal, _amount: Nat) : async {
        assert(withdrawing == false, "Withdraw in progress");
        withdrawing := true;
        let userQuotas = userInvestments[_userAddr];
        assert(userQuotas > 0, "Invalid amount");
        assert(userQuotas >= _amount, "Invalid amount");
        let _quotas = _getQuotaPrice();
        let _amount = _getAmountFromQuotas(_quotas);
        let _totalBalance = await tokenCanister.balanceOf(Principal.fromActor(this));
        assert(_totalBalance >= _amount, "Invalid amount");
        let success = await tokenCanister.transfer(_userAddr, _amount);
        if (success) { update state and investments }        
        }
    }


    public func claimRewards() : async {
        public func claimRewards() : async {
        let rewards = calculateRewards(Principal.fromActor(this));
        await tokenCanister.transfer(Principal.fromActor(this), rewards);
        }
    }


    private func _getQuotaQty(_amount: Nat) : Nat {
        let quotaPrice = _getQuotaPrice();
        return _amount / quotaPrice;
    }

    private func _getQuotaPrice() : Nat {
        return 100; 
    }

    private func _getAmountFromQuotas(_quotaAmount: Nat) : Nat {
        let quotaPrice = _getQuotaPrice();
        return _quotaAmount * quotaPrice;
    }

    public func setGasPriceMultiplier(gasPriceMultiplier: Nat) : async {
        gasPriceMultiplierStorage := gasPriceMultiplier;
    }

    public func setAaveRefCode(aaveRefCode: Nat16) : async {
        aaveRefCodeStorage := aaveRefCode;
    }

    public func updateInterval(interval: Nat) : async {
        intervalStorage := interval;
    }

    public func getAPY() : async Nat {
        return await lendingProtocolCanister.getAPY();
    }

    public func getQuotasPerAddress(_investor: Principal) : async Nat {
        return userQuotas[_investor];
    }

    public func getTotalInvested() : async Nat {
        return totalInvested;
    }

    public func getStatus() : async StrategyStatus {
        return status;
    }

    public func getWithdrawStatus() : async Bool {
        return withdrawing;
    }

    public func getGasPriceMultiplier() : async Nat {
        return gasPriceMultiplier;
    }

    public func getLastTimestamp() : async Nat {
        return lastTimestamp;
    }

    public func getInterval() : async Nat {
        return interval;
    }

    public func getTotalSupply() : async Nat {
        return await tokenCanister.totalSupply();
    }

    public func getTokenAddresses() : async [Principal] {
        return tokenAddresses;
    }

    public func getGasInfo() : async (Nat, Nat, Nat, Nat) {
        return (gasUsedDeposit, gasUsedSupply, gasUsedBorrow, gasPriceMultiplier);
    }
}