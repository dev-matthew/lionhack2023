import './App.css';
import { OnboardingButton } from './onboarding.js';
import ProposalList from './ProposalList.js';


import '@rainbow-me/rainbowkit/styles.css';

import React from 'react'
import { ethers } from 'ethers'

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

  class App extends React.Component {
  constructor () {
    super()

    this.state = {
      isConnected: false,
      contract: null,
      currentVoteId: 0,
    }

    this.onConnected = this.onConnected.bind(this)
    this.fetchCurrentVoteID = this.fetchCurrentVoteID.bind(this)
  }

  async onConnected () {
    // Use the MetaMask wallet as ethers provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create a JavaScript object from the Contract ABI, to interact
    // with the HelloWorld contract.
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider.getSigner()
    )
    console.log("why this shti")

    this.setState({
      isConnected: true,
      contract,
    })

    // Fetch the current message
    await this.fetchCurrentVoteID()
  }

  async fetchCurrentVoteID () {
    console.log('fetchCurrentVoteID')
    this.setState({ currentVoteId: await this.state.contract.getCurrentVoteId() })
  }

  render () {
    console.log('render', this.state)
    // const MessageComponent = <div>
    //   {this.state.currentVoteId
    //     ? <p>📯📯📯 Current message: 📯📯📯<br />&ldquo;{1}&rdquo;</p>
    //     : <p>Loading message...</p>
    //   }
    // </div>

    return (
      <div className="App">
        <h1>Cross-Chain Governance Propogation</h1>
        <p>Enables governance decisions for one protocol to propogate to all other chains</p>

        <OnboardingButton onConnected={this.onConnected} />
        <ProposalList/>
        


        {/* {this.state.isConnected && MessageComponent} */}
      </div>
    )
  }
}

export default App
