import React from 'react';
import { ethers } from 'ethers';

const contractAbi = [
  // Contract ABI
];
const contractAddress = "0x..."; // Contract address

class ProposalList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contract: null,
      currentVoteId: 0,
      proposals: [],
      votedIds: new Set(),
    };

    this.castVote = this.castVote.bind(this);
    this.fetchProposals = this.fetchProposals.bind(this);
  }

  async componentDidMount() {
    // Use the MetaMask wallet as ethers provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Create a JavaScript object from the Contract ABI, to interact
    // with the contract.
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider.getSigner()
    );

    this.setState({ contract }, this.fetchProposals);

    // Fetch the current vote ID
    const currentVoteId = await contract.getCurrentVoteId();
    this.setState({ currentVoteId });
  }

  async fetchProposals() {
    const { contract, currentVoteId } = this.state;

    // Fetch all proposals using getVote function
    const proposals = [];
    for (let i = 0; i <= currentVoteId; i++) {
      const proposal = await contract.getVote(i);
      proposals.push({ id: i, ...proposal });
    }
    this.setState({ proposals });
  }

  async castVote(id, vote) {
    const { contract, votedIds } = this.state;

    // Call the contract's castVote function with the given ID and vote (true or false)
    await contract.castVote(id, vote);

    // Update the list of voted IDs
    votedIds.add(id);
    this.setState({ votedIds });
  }

  render() {
    const { proposals, votedIds } = this.state;

    return (
      <div className="card">
        <h3 className="card-title">Proposals</h3>
        <div className="card-body">
          {proposals.map((proposal) => (
            <div className="proposal-row" key={proposal.id}>
              <div>{proposal.description}</div>
              <button
                className="vote-button yes-button"
                disabled={votedIds.has(proposal.id)}
                onClick={() => this.castVote(proposal.id, true)}
              >
                Yes
              </button>
              <button
                className="vote-button no-button"
                disabled={votedIds.has(proposal.id)}
                onClick={() => this.castVote(proposal.id, false)}
              >
                No
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ProposalList;

