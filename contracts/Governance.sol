// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

contract Governance is AxelarExecutable {

    IAxelarGasService public immutable gasService;
    address protocolAddress;

    uint256 currentVoteId = 0;
    mapping(uint256 => uint256) voteIdToVoteYes;
    mapping(uint256 => uint256) voteIdToVoteNo;
    mapping(uint256 => uint256) voteIdToEnd;

    /**
        Axelar Testnet Contract Addresses: https://docs.axelar.dev/dev/reference/testnet-contract-addresses
        
        Avalanche Fuji
        Gateway Contract: 0xC249632c2D40b9001FE907806902f63038B737Ab
        Gas Service Contract: 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
     */
    constructor(address gateway_, address gasReceiver_, address protocolAddress_) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
        protocolAddress = protocolAddress_;
    }

    function vote(uint256 voteId_, bool yes_) public {
        require(voteIdToEnd[voteId_] > 0, 'Invalid Vote ID');
        require(voteIdToEnd[voteId_] < block.timestamp, 'Voting period has ended');

        if (yes_) {
            voteIdToVoteYes[voteId_] += 1;
        } else {
            voteIdToVoteNo[voteId_] += 1;
        }
    }

    function createVote(uint256 end_) public {
        voteIdToEnd[currentVoteId] = end_;
        currentVoteId += 1;
    }

    function _execute(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload_) internal override{
        address newAddress = abi.decode(payload_, (address));
        protocolAddress = newAddress;
    }
}