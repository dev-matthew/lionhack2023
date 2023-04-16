import './App.css';
import { OnboardingButton } from './onboarding.js';
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
          "internalType": "uint256",
          "name": "newNumber_",
          "type": "uint256"
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
              "internalType": "uint256",
              "name": "newNumber",
              "type": "uint256"
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
  const contractAddress = "0xEa7fb821a0Af157080E53579225Df3d5a8AbBFE4"; // on Fuji (avalanche testnet)


  class App extends React.Component {
  constructor () {
    super()

    this.state = {
      isConnected: false,
      contract: null,
      currentVoteId: 0,
      votes: {}
    }

    this.onConnected = this.onConnected.bind(this);
    this.fetchCurrentVoteID = this.fetchCurrentVoteID.bind(this);
    this.fetchVoteDetails = this.fetchVoteDetails.bind(this);
  }

  componentDidMount() {
    this.onConnected();
    console.log("mounted")
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
    console.log("trigger")

    this.setState({
      isConnected: true,
      contract,
    })

    // Fetch the current message
    await this.fetchCurrentVoteID();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if state has updated
    if (this.state.contract !== prevState.contract) {
      // Run code that depends on updated state
      console.log("wefwefwf")
      this.fetchCurrentVoteID();
    }
  }


  async fetchVoteDetails(voteId) {
    console.log('fetchVoteDetails', voteId);
    const vote = await this.state.contract.getVote(voteId);
    this.setState(prevState => ({
      votes: {
        ...prevState.votes,
        [voteId]: vote
      }
    }));
  }

  async fetchCurrentVoteID() {
    // componentDidUpdate(prevProps, prevState)
  console.log("big balls")
  console.log(this.state.contract );
  const currentVoteId = await this.state.contract.getCurrentVoteId().then((res) => {console.log('dfsd')});
  this.setState({ currentVoteId: currentVoteId.toNumber() });

  // Fetch vote details for all votes from 0 to currentVoteId
  console.log(currentVoteId.toNumber())
  console.log(this.state.currentVoteId)

  for (let i = 0; i <= this.state.currentVoteId.toNumber(); i++) {
    console.log('dfdf')
    await this.fetchVoteDetails(i);
  }
}

  render () {
    console.log('render', this.state)
    return (
      <div className="App">
        <h1>Cross-Chain Governance Propogation</h1>
        <p>Enables governance decisions for one protocol to propogate to all other chains</p>

        <OnboardingButton onConnected={this.onConnected} />

        {this.state.isConnected && (
          <div className="card">
            <h2 className="card-subtitle">Proposal List</h2>
            <VotesTable votes={this.state.votes} />
          </div>
        )}
        
      </div>
    )
  }
}

function VotesTable({ votes }) {
  if (Object.keys(votes).length === 0) {
    return <p>Loading votes...</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Vote ID</th>
          <th>Description</th>
          <th>New Number</th>
          <th>End</th>
          <th>Yes</th>
          <th>No</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(votes).map(([voteId, vote]) => (
          <tr key={voteId}>
            <td>{voteId}</td>
            <td>{vote.description}</td>
            <td>{vote.newNumber}</td>
            <td>{vote.end}</td>
            <td>{vote.yes}</td>
            <td>{vote.no}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default App
