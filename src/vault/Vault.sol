// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/IArcUSDC.sol";

contract Vault {
    IArcUSDC public immutable usdc;
    address public perpEngine;

    mapping(address => uint256) public balances;

    error Unauthorized();
    error InsufficientBalance();

    constructor(address _usdc) {
        usdc = IArcUSDC(_usdc);
    }

    modifier onlyEngine() {
        if (msg.sender != perpEngine) revert Unauthorized();
        _;
    }

    function setPerpEngine(address _engine) external {
        if (perpEngine != address(0)) revert Unauthorized();
        perpEngine = _engine;
    }

    function deposit(uint256 amount) external {
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "transfer failed"
        );

        balances[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external {
        if (balances[msg.sender] < amount)
            revert InsufficientBalance();

        balances[msg.sender] -= amount;

        require(
            usdc.transfer(msg.sender, amount),
            "withdraw failed"
        );
    }

    function debit(
        address trader,
        uint256 amount
    ) external onlyEngine {
        if (balances[trader] < amount)
            revert InsufficientBalance();

        balances[trader] -= amount;
    }

    function credit(
        address trader,
        uint256 amount
    ) external onlyEngine {
        balances[trader] += amount;
    }
}
