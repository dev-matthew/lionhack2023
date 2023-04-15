// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';

contract Protocol is AxelarExecutable {

    address logicAddress;

    /**
        Axelar Testnet Contract Addresses: https://docs.axelar.dev/dev/reference/testnet-contract-addresses
        
        Avalanche Fuji
        Gateway Contract: 0xC249632c2D40b9001FE907806902f63038B737Ab
        Gas Service Contract: 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
     */
    constructor(address gateway_, address gasReceiver_, address logicAddress_) AxelarExecutable(gateway_) {
        logicAddress = logicAddress_;
    }

    function _execute(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload_) internal override {
        address newAddress = abi.decode(payload_, (address));
        logicAddress = newAddress;
    }
}