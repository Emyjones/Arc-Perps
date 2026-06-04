// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OracleManager {
    address public owner;

    struct PriceData {
        uint256 price;
        uint256 updatedAt;
    }

    mapping(bytes32 => PriceData) public prices;

    error Unauthorized();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    function updatePrice(
        bytes32 pair,
        uint256 price
    ) external onlyOwner {
        prices[pair] = PriceData({
            price: price,
            updatedAt: block.timestamp
        });
    }

    function getPrice(
        bytes32 pair
    ) external view returns (uint256) {
        return prices[pair].price;
    }

    function getPriceData(
        bytes32 pair
    )
        external
        view
        returns (uint256 price, uint256 updatedAt)
    {
        PriceData memory p = prices[pair];
        return (p.price, p.updatedAt);
    }
}
