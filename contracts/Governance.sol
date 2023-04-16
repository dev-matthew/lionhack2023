// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract Governance {
    struct Vote {
        string description;
        address newProxy;
        uint256 end;
        uint256 yes;
        uint256 no;
    }

    uint256 currentVoteId = 0;
    mapping(uint256 => Vote) voteIdToVote;

    struct Protocol {
        address gateway;
        string destinationChain;
        string protocolAddress;
        IAxelarGasService gasSerivce;
    }

    Protocol[] protocols;

    constructor(
        address[] memory gateways_,
        string[] memory destinationChains_,
        string[] memory protocols_,
        address[] memory gasReceivers_
    ) {
        for (uint i = 0; i < gateways_.length; i += 1) {
            protocols.push(
                Protocol(
                    gateways_[i],
                    destinationChains_[i],
                    protocols_[i],
                    IAxelarGasService(gasReceivers_[i])
                )
            );
        }
    }

    function getCurrentVoteId() public view returns (uint256) {
        return currentVoteId;
    }

    function getVote(uint256 voteId_) public view returns (Vote memory) {
        return voteIdToVote[voteId_];
    }

    function createVote(
        uint256 end_,
        string memory description_,
        address newProxy_
    ) public {
        voteIdToVote[currentVoteId] = Vote(description_, newProxy_, end_, 0, 0);
        currentVoteId += 1;
    }

    function castVote(uint256 voteId_, bool yes_) public {
        require(voteIdToVote[voteId_].end > 0, 'Invalid Vote ID');
        // require(voteIdToVote[voteId_].end > block.timestamp, 'Voting period has ended');

        if (yes_) {
            voteIdToVote[voteId_].yes += 1;
        } else {
            voteIdToVote[voteId_].no += 1;
        }
    }

    function endVote(uint256 voteId_) public payable {
        // require(voteIdToVote[voteId_].end <= block.timestamp, 'Voting period has not ended');

        if (voteIdToVote[voteId_].yes >= voteIdToVote[voteId_].no) {
            for (uint i = 0; i < protocols.length; i += 1) {
                address newProxy = voteIdToVote[voteId_].newProxy;
                bytes memory payload = abi.encode(newProxy);

                if (msg.value > 0) {
                    protocols[i].gasSerivce.payNativeGasForContractCall{
                        value: msg.value
                    }(
                        address(this),
                        protocols[i].destinationChain,
                        protocols[i].protocolAddress,
                        payload,
                        msg.sender
                    );
                }

                IAxelarGateway(protocols[i].gateway).callContract(
                    protocols[i].destinationChain,
                    protocols[i].protocolAddress,
                    payload
                );
            }
        }
    }
}
