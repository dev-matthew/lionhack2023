
import React from 'react'
import MetaMaskOnboarding from '@metamask/onboarding'

const AVALANCHE_TESTNET_PARAMS = {
  chainId: '0xA869',
  chainName: 'Avalanche Testnet C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
}

// This code uses the Avalanche Test Network. If you want to use the main network, simply
// change this to AVALANCHE_MAINNET_PARAMS
const AVALANCHE_NETWORK_PARAMS = AVALANCHE_TESTNET_PARAMS

// Check if the chain id is the selected Avalanche chain id
const isAvalancheChain = (chainId) => (
  chainId &&
  chainId.toLowerCase() === AVALANCHE_NETWORK_PARAMS.chainId.toLowerCase()
)

export class OnboardingButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      accounts: [],
      chainId: 0xA869,
      onboarding: new MetaMaskOnboarding()
    }

    this.connectMetaMask = this.connectMetaMask.bind(this)
    // this.switchToAvalancheChain = this.switchToAvalancheChain.bind(this)
  }

  // componentDidMount () {
  //   if (MetaMaskOnboarding.isMetaMaskInstalled()) {
  //     this.connectMetaMask()

  //     // Update the list of accounts if the user switches accounts in MetaMask
  //     window.ethereum.on('accountsChanged', accounts => this.setState({ accounts }))

  //     // Reload the site if the user selects a different chain
  //     window.ethereum.on('chainChanged', () => window.location.reload())

  //     // Set the chain id once the MetaMask wallet is connected
  //     window.ethereum.on('connect', (connectInfo) => {
  //       const chainId = connectInfo.chainId
  //       this.setState({ chainId })
  //       if (isAvalancheChain(chainId)) {
  //         // The user is now connected to the MetaMask wallet and has the correct
  //         // Avalanche chain selected.
  //         this.props.onConnected()
  //       }
  //     });
  //   }
  // }

  connectMetaMask () {
    // Request to connect to the MetaMask wallet
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => this.setState({ accounts }))
  }

  // switchToAvalancheChain () {
  //   // Request to switch to the selected Avalanche network
  //   window.ethereum
  //     .request({
  //       method: 'wallet_addEthereumChain',
  //       params: [AVALANCHE_TESTNET_PARAMS]
  //     })
  // }

  render () {
     if (this.state.accounts.length === 0) {
      // If accounts is empty the user is not yet connected to the MetaMask wallet.
      // Ask the user to connect to MetaMask.
      return (
        <div>
          <div>To run this dApp you need to connect your wallet.</div>
          <button onClick={this.connectMetaMask}>
            Connect your Wallet
          </button>
        </div>
      )
    } else {
      // The user is connected to the MetaMask wallet and has the Avalanche chain selected.
      return <div>
        <div>Core Wallet connected and set to Fuji Testnet!</div>
        <div>Chain: {this.state.chainId}</div>
        <div>Account: {this.state.accounts[0]}</div>
      </div>
    }
  }
}