import React from 'react';

class VoteRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
  }

  handleApprove() {
    this.props.castVote(this.props.voteId, true);
  }

  handleReject() {
    this.props.castVote(this.props.voteId, false);
  }

  render() {
    const { voteDescription } = this.props;

    return (
      <tr>
        <td>{voteDescription}</td>
        <td>
          <button onClick={this.handleApprove}>Approve</button>
        </td>
        <td>
          <button onClick={this.handleReject}>Reject</button>
        </td>
      </tr>
    );
  }
}

export default VoteRow;
