import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor SupplyUni {
    // Constants
    let DEADLINE: Nat = 60 * 30; 

    // Types
    type Pool = {
        token0: Principal;
        token1: Principal;
        poolFee: Nat;
        isActive: Bool;
    };
    type OwnerDeposit = {
        tokenId: Nat;
        liquidity: Nat;
        amount0: Nat;
        amount1: Nat;
        initialized: Bool;
    };

    // State
    private var poolCount: Nat = 0;
    private var pools: [var Pool] = [];
    private var deposits: [var (Principal, [var OwnerDeposit])] = [];    

    // Function to add a new pool
    public func addPool(token0: Principal, token1: Principal, poolFee: Nat) : async {
        for (var i = 0; i < poolCount; i += 1) {
            if (pools[i].token0 == token0 && pools[i].token1 == token1) {
                // Pool already exists, throw an error
                assert(false, "Pool already exists");
            }
        }

        // Create a new pool
        let newPool: Pool = {
            token0 = token0;
            token1 = token1;
            poolFee = poolFee;
            isActive = true;
        };

        // Add the new pool to the list of pools
        pools.push(newPool);
        poolCount += 1;
    }

    // View functions
    public query func getOwnerInfo(owner: Principal, poolId: Nat) : async OwnerDeposit {
        let pool = pools[poolId];
        let ownerDeposits = deposits[owner];

        for (var i = 0; i < ownerDeposits.length; i += 1) {
            if (ownerDeposits[i].tokenId == poolId) {
                return ownerDeposits[i];
            }
        }

        // Owner deposit not found, return default value
        return {
            tokenId = 0;
            liquidity = 0;
            amount0 = 0;
            amount1 = 0;
            initialized = false;
        };
    }

    public query func getPool(poolId: Nat) : async Pool {
        assert(poolId < poolCount, "Pool does not exist");
        return pools[poolId];
    }


    // Function to add a new pool
    public func addPool(token0: Principal, token1: Principal, poolFee: Nat) : async {
        for (var i = 0; i < poolCount; i += 1) {
            if (pools[i].token0 == token0 && pools[i].token1 == token1) {
                // Pool already exists, throw an error
                assert(false, "Pool already exists");
            }
        }

        // Create a new pool
        let newPool: Pool = {
            token0 = token0;
            token1 = token1;
            poolFee = poolFee;
            isActive = true;
        };

        // Add the new pool to the list of pools
        pools.push(newPool);
        poolCount += 1;
    }

    public func mintNewPosition(poolId: Nat, amount0: Nat, amount1: Nat, maxSlip: Nat) : async {
        // Verify pool exists
        assert(poolId < poolCount, "Pool does not exist");
        let pool = pools[poolId];
    }


    // Function to increase position
    public func increasePosition(poolId: Nat, amountAdd0: Nat, amountAdd1: Nat, maxSlip: Nat) : async {
        // Verify pool exists
        assert(poolId < poolCount, "Pool does not exist");
        let pool = pools[poolId];

        // Calculate the new position amounts
        let newPosition0 = pool.amount0 + amountAdd0;
        let newPosition1 = pool.amount1 + amountAdd1;

        // Verify that the new position does not exceed the maximum slip
        assert(newPosition0 <= pool.amount0 * (1 + maxSlip / 100), "Exceeds maximum slip");
        assert(newPosition1 <= pool.amount1 * (1 + maxSlip / 100), "Exceeds maximum slip");

        // Update the pool's position amounts
        pool.amount0 := newPosition0;
        pool.amount1 := newPosition1;

        // Update the pool in the list of pools
        pools[poolId] := pool;
    }

    // Function to collect all fees
    public func collectAllFees(poolId: Nat) : async {
        // Verify pool exists
        assert(poolId < poolCount, "Pool does not exist");
        let pool = pools[poolId];

        // Calculate the fees to be collected
        let feeAmount0 = pool.amount0 * pool.poolFee / 100;
        let feeAmount1 = pool.amount1 * pool.poolFee / 100;

        // Update the pool's position amounts
        pool.amount0 := pool.amount0 - feeAmount0;
        pool.amount1 := pool.amount1 - feeAmount1;

        // Transfer the collected fees to the contract owner
        // ... (implementation depends on the contract's design)

        // Update the pool in the list of pools
        pools[poolId] := pool;
    }

    // Function to decrease position
    public func decreasePosition(poolId: Nat, percentageAmm: Nat, maxSlip: Nat) : async {
        // Verify pool exists
        assert(poolId < poolCount, "Pool does not exist");
        let pool = pools[poolId];

        // Calculate the decrease amounts based on the percentage
        let decreaseAmount0 = pool.amount0 * percentageAmm / 100;
        let decreaseAmount1 = pool.amount1 * percentageAmm / 100;

        // Verify that the decrease amounts do not exceed the maximum slip
        assert(decreaseAmount0 <= pool.amount0 * (1 + maxSlip / 100), "Exceeds maximum slip");
        assert(decreaseAmount1 <= pool.amount1 * (1 + maxSlip / 100), "Exceeds maximum slip");

        // Update the pool's position amounts
        pool.amount0 := pool.amount0 - decreaseAmount0;
        pool.amount1 := pool.amount1 - decreaseAmount1;

        // Update the pool in the list of pools
        pools[poolId] := pool;
    }

    public query func getOwnerInfo(owner: Principal, poolId: Nat) : async OwnerDeposit {
        // Logic to get owner info
        let pool = await getPool(poolId);
        let ownerDeposit = {
            owner = owner;
            depositAmount0 = pool.amount0;
            depositAmount1 = pool.amount1;
        };
        return ownerDeposit;
    }

    public query func getPool(poolId: Nat) : async Pool {
        // Logic to get pool info
        assert(poolId < poolCount, "Pool does not exist");
        return pools[poolId];
    }
}