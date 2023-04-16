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
          "internalType": "address",
          "name": "newProxy_",
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
              "name": "newProxy",
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
  ]

const protocolAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "gateway_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "gasReceiver_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "proxyContract_",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "InvalidAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotApprovedByGateway",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "commandId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "sourceChain",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sourceAddress",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "payload",
          "type": "bytes"
        }
      ],
      "name": "execute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "commandId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "sourceChain",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sourceAddress",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "payload",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "tokenSymbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "executeWithToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gateway",
      "outputs": [
        {
          "internalType": "contract IAxelarGateway",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProxyContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const contractAddress = "0x2b90AF0fcB70B7F4c7aE4BaeB71eB46541B9FcED"; // on Fuji (avalanche testnet)

const protocolAddy = "0xe4b1D10d746506D2F2B7CE1CfC3a94946EdE8f75";
class App extends React.Component {
  constructor () {
    super()

    this.state = {
      count: 0,
      isConnected: false,
      contract: null,
      currentVoteId: 0,
      votes: {},
      proxyContract: ""
    }

    this.onConnected = this.onConnected.bind(this);
    this.fetchCurrentVoteID = this.fetchCurrentVoteID.bind(this);
    this.fetchVoteDetails = this.fetchVoteDetails.bind(this);
  }

  componentDidMount() {
    this.onConnected();
    this.fetchProtocolProxy(protocolAddy)
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
      this.fetchCurrentVoteID();
    }
  }


  async fetchVoteDetails(voteId) {
   
    const vote = await this.state.contract.getVote(voteId);
    console.log(vote)
    const newVotes = this.state.votes.push(vote);
    console.log('sdgjdsnfgjf')
    this.setState({ votes: newVotes });
    console.log('sdgfkjsbfodsb')
  }

  async handleVote(choice, voteId) {
    console.log('sdfonsdfgobsdfngobn')
    await this.state.contract.castVote(voteId, choice);
    console.log('vote has been cast')

  }

  async fetchCurrentVoteID() {
    // componentDidUpdate(prevProps, prevState)
  const currentVoteId = await this.state.contract.getCurrentVoteId().then( async (res) => {
    console.log(res.toNumber())
      this.setState({ currentVoteId: res.toNumber() });
      // Fetch vote details for all votes from 0 to currentVoteId
  const votes = [];
  for (let i = 0; i < res.toNumber(); i++) {
    let newvote = [];
    console.log('dfdf')
    let vote = await this.state.contract.getVote(i);
    console.log(vote)

    // array of [end, desc, proxy]
    newvote.push(vote[2].toNumber())
    newvote.push(vote[0])
    newvote.push(vote[1])
    votes.push(newvote);
  }
  this.setState({ votes: votes });
  });
}

async fetchProtocolProxy(protocol) {
    
  const goerliProvider = new ethers.providers.AlchemyProvider('arbitrum-goerli', 'GV1SRRl97cUIQtS-_AzmjsP3vZA0_hvR');
    
    console.log(goerliProvider)
    const contract = new ethers.Contract(
      protocol,
      protocolAbi,
      goerliProvider
    )
    
    console.log('sdfonsdfgobsdfngobn')
        console.log(contract)
      console.log(goerliProvider.getCode(protocol))
    const result = await contract.getProxyContract()
      console.log(result)
      this.setState({ proxyContract: result });
      console.log('success')
    console.log('contrcat retrieved')
}

handleClick = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }));
  }

  render () {
    console.log('render', this.state)
    return (
      <div className="App">
        <h1>GovernNet</h1>
        <h3>Cross-Chain Governance Propogation</h3>
        <p>Enables governance decisions for one protocol to propogate to all other chains</p>

        <OnboardingButton onConnected={this.onConnected} />
        <button onClick={this.handleClick}>Reload</button>

        {this.state.isConnected && (
          <div className="card">
            <h2 className="card-subtitle">Proposal List</h2>
            <VotesTable votes={this.state.votes} />
          </div>
        )}

        {this.state.isConnected && (
          <div className="card">
            <h2 className="card-subtitle">Protocol Dashboard</h2>
            <p>Protocol (fetchProtocolProxy): </p>
            <p>{this.state.proxyContract}</p>
            <button onClick={() => this.fetchProtocolProxy(protocolAddy)}>refresh protocol!</button>
          </div>
        )}
        
      </div>
    )
  }
}

function VotesTable({ votes }) {
  
  // const extraVotes = {
  //   1: { description: "Increase fee by 1%", newNumber: 0, end: 20, yes: 0, no: 0 },
  //   2: { description: "Add transfer functionality to token protocol", newNumber: 10, end: 26, yes: 0, no: 0 },
  //   3: { description: "Increase max liquidity pool", newNumber: 20, end: 32, yes: 0, no: 0 }
  // };

  // const allVotes = { ...votes, ...extraVotes };
  const handleVote = async (choice, voteId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create a JavaScript object from the Contract ABI, to interact
    // with the HelloWorld contract.
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider.getSigner()
    )
    
    console.log('sdfonsdfgobsdfngobn')
    console.log(voteId)
    console.log(choice)
    await contract.castVote(parseInt(voteId), choice).then(console.log('dsfosdfjds'));
    console.log('vote has been cast')

  }

  const endVoting = async (voteId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create a JavaScript object from the Contract ABI, to interact
    // with the HelloWorld contract.
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider.getSigner()
    )
    
    console.log('sdfonsdfgobsdfngobn')
    await contract.endVote(voteId, {value: ethers.utils.parseEther("2")}).then (console.log('dsfosdfjds'));
    console.log('vote has been cast')

  }
  
  return (
    <table>
      <thead>
        <tr>
          <th>Vote ID</th>
          <th>Description</th>
          <th>New Proxy Contract</th>
          <th>End</th>
          <th>Yes</th>
          <th>No</th>
          <th>Fast Forward</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(votes).map(([voteId, vote]) => (
          <tr key={voteId}>
            <td>{voteId}</td>
            <td>{vote[1]}</td>
            <td>{vote[2]}</td>
            <td>{vote[0]}</td>
            <td>{<button onClick={() => handleVote(true, voteId)}>yes</button>}</td>
            <td>{<button onClick={() => handleVote(false, voteId)}>no</button>}</td>
            <td>{<button onClick={() => endVoting(voteId)}>End Voting</button>}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
        }


export default App
