// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/vault/Vault.sol";
import "../src/oracle/OracleManager.sol";
import "../src/PerpEngine.sol";

contract Deploy is Script {
    address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

    function run() external {
        vm.startBroadcast();

        Vault vault = new Vault(ARC_USDC);

        OracleManager oracle = new OracleManager();

        PerpEngine engine = new PerpEngine(address(vault), address(oracle));

        vault.setPerpEngine(address(engine));

        vm.stopBroadcast();

        console2.log("Vault:", address(vault));

        console2.log("Oracle:", address(oracle));

        console2.log("PerpEngine:", address(engine));
    }
}
