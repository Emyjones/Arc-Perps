// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./vault/Vault.sol";
import "./oracle/OracleManager.sol";

contract PerpEngine {
    Vault public vault;
    OracleManager public oracle;

    enum Side {
        LONG,
        SHORT
    }

    struct Position {
        bytes32 pair;
        uint256 size;
        uint256 entryPrice;
        uint256 collateral;
        uint256 leverage;
        Side side;
        bool open;
    }

    mapping(address => Position) public positions;

    error PositionExists();
    error NoPosition();
    error InvalidLeverage();

    constructor(address _vault, address _oracle) {
        vault = Vault(_vault);
        oracle = OracleManager(_oracle);
    }

    function openPosition(bytes32 pair, uint256 collateral, uint256 leverage, Side side) external {
        if (positions[msg.sender].open) {
            revert PositionExists();
        }

        if (leverage < 1 || leverage > 20) {
            revert InvalidLeverage();
        }

        uint256 price = oracle.getPrice(pair);

        vault.debit(msg.sender, collateral);

        positions[msg.sender] = Position({
            pair: pair,
            size: collateral * leverage,
            entryPrice: price,
            collateral: collateral,
            leverage: leverage,
            side: side,
            open: true
        });
    }

    function closePosition() external {
        Position memory pos = positions[msg.sender];

        if (!pos.open) revert NoPosition();

        uint256 currentPrice = oracle.getPrice(pos.pair);

        int256 pnl = calculatePnL(pos, currentPrice);

        if (pnl > 0) {
            vault.credit(msg.sender, pos.collateral + uint256(pnl));
        } else {
            uint256 loss = uint256(-pnl);

            if (loss >= pos.collateral) {
                vault.credit(msg.sender, 0);
            } else {
                vault.credit(msg.sender, pos.collateral - loss);
            }
        }

        delete positions[msg.sender];
    }

    function calculatePnL(Position memory pos, uint256 currentPrice) public pure returns (int256) {
        if (pos.side == Side.LONG) {
            return int256((pos.size * (currentPrice - pos.entryPrice)) / pos.entryPrice);
        } else {
            return int256((pos.size * (pos.entryPrice - currentPrice)) / pos.entryPrice);
        }
    }
}
