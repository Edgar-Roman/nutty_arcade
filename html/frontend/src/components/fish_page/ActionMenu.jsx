import React from 'react';
import './Fish.css'

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        buttonWasClicked: ''
    }
  }

  handleButtonClick(buttonName, event) {
    this.setState({ buttonWasClicked: buttonName });
  }

  render() {
    return (
        <div className="menu">
            <button type="button" disabled={!(this.props.player === this.props.currentPlayer && this.props.gameStarted)} className="ask" onClick={e => this.handleButtonClick('ask', e)}>Ask!</button>
            <button type="button" disabled={!(this.props.player === this.props.currentPlayer && this.props.gameStarted)} className="declare" onClick={e => this.handleButtonClick('declare', e)}>Declare!</button>
            <button type="button" disabled={!(this.props.player === this.props.currentPlayer && this.props.gameStarted)} className="pass" onClick={e => this.handleButtonClick('pass', e)}>Pass!</button>
              {this.state.buttonWasClicked === 'ask' && this.props.player === this.props.currentPlayer &&
              <div className="input">
                <select name="suits" id="id_suits" multiple>
                  <option className="red" value="Red"></option>
                  <option className="orange" value="Orange"></option>
                  <option className="yellow" value="Yellow"></option>
                  <option className="green" value="Green"></option>
                  <option className="blue" value="Blue"></option>
                  <option className="purple" value="Purple"></option>
                  <option className="grey" value="Grey"></option>
                  <option className="brown" value="Brown"></option>
                  <option className="black" value="Black"></option>
                </select>
                <select name="ranks" id="id_ranks" multiple>
                  <option className="white" value="1">1</option>
                  <option className="white" value="2">2</option>
                  <option className="white" value="3">3</option>
                  <option className="white" value="4">4</option>
                  <option className="white" value="5">5</option>
                  <option className="white" value="6">6</option>
                </select>
                <br/>
                <select name="players" id="id_players">
                  {this.props.opponents}
                </select>
                <br/>
                <div>
                    <button type="button" id="submit-ask" onClick={() => this.props.handleAsk()}>Submit</button>
                </div>
                <p>{this.props.message}</p>
              </div>
              }
              {
              this.state.buttonWasClicked === 'declare' && this.props.player === this.props.currentPlayer &&
              <div className="input">
                <select name="suits" id="id_suits" multiple>
                  <option className="red" value="0"></option>
                  <option className="orange" value="1"></option>
                  <option className="yellow" value="2"></option>
                  <option className="green" value="3"></option>
                  <option className="blue" value="4"></option>
                  <option className="purple" value="5"></option>
                  <option className="grey" value="6"></option>
                  <option className="brown" value="7"></option>
                  <option className="black" value="8"></option>
                </select>
                <br/>
                <select name="players" id="id1">
                  {this.props.teammates}
                </select>
                <select name="players" id="id2">
                  {this.props.teammates}
                </select>
                <select name="players" id="id3">
                  {this.props.teammates}
                </select>
                <select name="players" id="id4">
                  {this.props.teammates}
                </select>
                <select name="players" id="id5">
                  {this.props.teammates}
                </select>
                <select name="players" id="id6">
                  {this.props.teammates}
                </select>
                <div>
                    <br/>
                    <button type="button" id="submit-declare" onClick={() => this.props.handleDeclare()}>Submit</button>
                </div>
                <p>{this.props.message}</p>
            </div>
            }
            {
            this.state.buttonWasClicked === 'pass' && this.props.player === this.props.currentPlayer &&
            <div className="input">
                <select name="players" id="teammate">
                  {this.props.teammates}
                </select>
                <div>
                    <br/>
                    <button type="button" id="submit-pass" onClick={() => this.props.handlePass()}>Submit</button>
                </div>
                <p>{this.props.message}</p>
            </div>
            }
        </div>
    );
  }
}

export {
    ActionMenu
}