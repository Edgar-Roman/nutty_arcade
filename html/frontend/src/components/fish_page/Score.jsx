import React from 'react';
import './Fish.css'

class TeamScore extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div id="team">
            <h3>{this.props.score}</h3>
        </div>
    );
  }
}

class OpponentScore extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div id="opponent">
            <h3>{this.props.score}</h3>
        </div>
    );
  }
}

export {
    TeamScore,
    OpponentScore
}
