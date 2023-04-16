import './App.css';
import Governance from './methods.js';
import { OnboardingButton } from './onboarding.js';
// import React, { useState } from "react";
import { useContractRead } from 'wagmi';

// import { ethers } from "ethers";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// import { useProvider } from 'wagmi'
// import { useContractRead } from 'wagmi'

import { InjectedConnector } from 'wagmi/connectors/injected'



// const provider = new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");




// async function fetchWidgetInfo() {
//   // Call the function that returns widget information, e.g. an API endpoint
//   const response = await fetch("/api/widget-info");
//   const data = await response.json();
//   return data;
// }

// function App() {

//   const { chains, provider } = configureChains(
//     [avalancheFuji],
//     [
//       publicProvider()
//     ]
//   );

//   const { connectors } = getDefaultWallets({
//     appName: 'My RainbowKit App',
//     projectId: 'ed46ac979604cd7d35844b7cd64b731d',
//     chains
//   });

//   const wagmiClient = createClient({
//     autoConnect: true,
//     connectors,
//     provider
//   })


//   const [widgetInfo, setWidgetInfo] = useState(null);

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
      currentVoteId: null,
      messageInterval: null
    }

    this.onConnected = this.onConnected.bind(this)
    this.fetchCurrentVoteID = this.fetchCurrentVoteID.bind(this)
  }

  componentWillUnmount () {
    if (this.state.messageInterval) {
      clearInterval(this.state.messageInterval)
    }
  }

  async onConnected () {
    // Use the MetaMask wallet as ethers provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create a JavaScript object from the Contract ABI, to interact
    // with the HelloWorld contract.
    const contract = new ethers.Contract(
      contractAddress.Contract,
      contractAbi,
      provider.getSigner()
    )

    this.setState({
      isConnected: true,
      contract,
      // Start fetching the contract's message every 30 seconds
      messageInterval: setInterval(this.fetchMessage, 30000)
    })

    // Fetch the current message
    await this.fetchCurrentVoteID()
  }

  async fetchCurrentVoteID () {
    console.log('fetchCurrentVoteID')
    this.setState({ currentVoteId: await this.state.contract.getCurrentVoteId() })
  }

  render () {
    const MessageComponent = <div>
      {this.state.currentVoteId
        ? <p>📯📯📯 Current message: 📯📯📯<br />&ldquo;{this.state.currentMessage}&rdquo;</p>
        : <p>Loading message...</p>
      }
    </div>

    return (
      <div className="App">
        <h1>My Awesome dApp</h1>
        <h2>HelloWorld on Avalanche</h2>

        <OnboardingButton onConnected={this.onConnected} />

        {this.state.isConnected && MessageComponent}
      </div>
    )
  }
}

export default App

//   return (
//     <WagmiConfig client={wagmiClient}>
//       <RainbowKitProvider chains={chains}>
//         <div className="dashboard">
//         <header>
//           <h1>Cross-Chain Governance Propogation</h1>
//           <p>Enables governance decisions for one protocol to propogate to all other chains</p>
//           {/* vote all active votes*/}
//           <p>Steps:</p>
//           <p>1. Sign into wallet</p>
//           <p>2. Recieve list of protocol decisions to make</p>
//           <p>3. :</p>
//           <p>Steps:</p>
//           {/* <ConnectButton /> */}
//           <OnboardingButton/>
//           <Governance />
//         </header>
//         <div className="modules">
//           <div className="left-module">
//             <h2 className="module-header">
//               Input Fields to Update Voting Cross-Chain
//             </h2>
//             {/* <form onSubmit={this.handleSubmit}> */}
//               <div className="form-group">
                
//               </div>
//               <div className="form-group">
//                 <label htmlFor="sourceAddress">Source Address:</label>
//                 <input
//                   id="sourceAddress"
//                   name="sourceAddress"
//                   type="text"
//                   value={0}
//                   // onChange={this.handleInputChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="payload">Payload:</label>
//                 <textarea
//                   id="payload"
//                   name="payload"
//                   value={0}
//                   // onChange={this.handleInputChange}
//                 />
//               </div>
//               <button type="submit">Submit</button>
//             {/* </form> */}
//           </div>
//           <div className="right-module">
//             <h2 className="module-header">Transaction List</h2>
//             <ul className="transaction-list">
//               {/* {transactions.map((transaction, index) => (
//                 <li key={index} className="transaction-item">
//                   <p>Source Chain: {transaction.sourceChain}</p>
//                   <p>Source Address: {transaction.sourceAddress}</p>
//                   <p>Payload: {transaction.payload}</p>
//                 </li>
//               ))} */}
//             </ul>
//           </div>
//         </div>
//       </div>
//       </RainbowKitProvider>
//     </WagmiConfig>
//   );
// }

// export default App;


