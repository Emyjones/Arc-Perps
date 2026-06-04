// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../vault/Vault.sol";
import "../oracle/OracleManager.sol";

contract PositionManager {
    enum PositionType {
        LONG,
        SHORT
    }

    struct Position {
        address trader;
        bytes32 market;
        PositionType positionType;

        uint256 collateral;
        uint256 leverage;
        uint256 size;

        uint256 entryPrice;
        uint256 liquidationPrice;

        bool isOpen;
    }

    Vault public vault;
    OracleManager public oracle;

    uint256 public nextPositionId;

    mapping(uint256 => Position) public positions;
    mapping(address => uint256[]) public userPositions;

    event PositionOpened(
        uint256 indexed positionId,
        address indexed trader,
        bytes32 indexed market,
        PositionType positionType,
        uint256 collateral,
        uint256 leverage,
        uint256 entryPrice
    );

    event PositionClosed(
        uint256 indexed positionId,
        address indexed trader,
        int256 pnl
    );

    constructor(address _vault, address _oracle) {
        vault = Vault(_vault);
        oracle = OracleManager(_oracle);
    }


    function openPosition(
      bytes32 market,
      PositionType positionType,
      uint256 collateral,
      uint256 leverage
      ) external {

      require(collateral > 0, "Invalid collateral");
      require(leverage >= 1 && leverage <= 50, "Invalid leverage");

      uint256 price = oracle.getPrice(market);

      uint256 size = collateral * leverage;

      uint256 liquidationPrice;

      if (positionType == PositionType.LONG) {
          liquidationPrice =
              price -
              ((price * 80) / (leverage * 100));
      } else {
          liquidationPrice =
              price +
              ((price * 80) / (leverage * 100));
      }

      positions[nextPositionId] = Position({
          trader: msg.sender,
          market: market,
          positionType: positionType,
          collateral: collateral,
          leverage: leverage,
          size: size,
          entryPrice: price,
          liquidationPrice: liquidationPrice,
          isOpen: true
      });

      userPositions[msg.sender].push(nextPositionId);

      emit PositionOpened(
          nextPositionId,
          msg.sender,
          market,
          positionType,
          collateral,
          leverage,
          price
      );

      nextPositionId++;
    }

    function getPositionPnl(
      uint256 positionId
      ) public view returns (int256) {

      Position memory position = positions[positionId];

      uint256 currentPrice = oracle.getPrice(position.market);

      if (position.positionType == PositionType.LONG) {

          return int256(
              (position.size *
                  (currentPrice - position.entryPrice))
                  / position.entryPrice
          );

      } else {

          return int256(
              (position.size *
                  (position.entryPrice - currentPrice))
                  / position.entryPrice
          );
        }
    }

    function closePosition(
      uint256 positionId
      ) external {

      Position storage position = positions[positionId];

      require(position.isOpen, "Position closed");
      require(
          position.trader == msg.sender,
          "Not position owner"
      );

      int256 pnl = getPositionPnl(positionId);

      position.isOpen = false;

      uint256 payout;

      if (pnl >= 0) {

          payout =
              position.collateral +
              uint256(pnl);

      } else {

          uint256 loss = uint256(-pnl);

          if (loss >= position.collateral) {
              payout = 0;
          } else {
              payout =
                  position.collateral -
                  loss;
          }
        }

      vault.credit(msg.sender, payout);

      emit PositionClosed(
          positionId,
          msg.sender,
          pnl
      );
    }

    function liquidatePosition(
        uint256 positionId
        ) external {

        Position storage position =
            positions[positionId];

        require(position.isOpen, "Closed");

        uint256 currentPrice =
            oracle.getPrice(position.market);

        bool canLiquidate;

        if (
            position.positionType ==
            PositionType.LONG
        ) {

            canLiquidate =
                currentPrice <=
                position.liquidationPrice;

        } else {

            canLiquidate =
                currentPrice >=
                position.liquidationPrice;
        }

        require(
            canLiquidate,
            "Not liquidatable"
        );

        position.isOpen = false;

        emit PositionClosed(
            positionId,
            position.trader,
            -int256(position.collateral)
        );
    }


}