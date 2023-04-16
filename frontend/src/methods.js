import React from 'react';
import { useContractRead } from 'wagmi';



const Governance = () => {
    const contractAbi = [
  {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "gateways_",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "destinationChains_",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "protocols_",
          "type": "string[]"
        },
        {
          "internalType": "address[]",
          "name": "gasReceivers_",
          "type": "address[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "voteId_",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "yes_",
          "type": "bool"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "end_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description_",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "newContract_",
          "type": "address"
        }
      ],
      "name": "createVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "voteId_",
          "type": "uint256"
        }
      ],
      "name": "endVote",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentVoteId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "voteId_",
          "type": "uint256"
        }
      ],
      "name": "getVote",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "newContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "end",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "yes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "no",
              "type": "uint256"
            }
          ],
          "internalType": "struct Governance.Vote",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  
            ];
  const contractAddress = "0x52AACf568ddC7A11d6790bca8217544836e14477"; // on Fuji (avalanche testnet)

  const { data, isError, isLoading } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractAbi,
    },
    'getCurrentVoteId',
  )
  
  console.log(data);


  if (isLoading) {
    return (<p>Loading current vote ID...</p>);
  }

  if (isError) {
    return (<p>There was an error fetching the current vote ID. Please try again.</p>);
  }

  return (
    <div>
        <p>Current vote ID:{data}</p>
    </div>
  );
};

export default Governance;
