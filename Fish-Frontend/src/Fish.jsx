import React from 'react';
import './Fish.css';

class Fish extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            buttonWasClicked: '',
            message: '',
            handToDisplay: [],
            /*['./cards/image_part_001.png', './cards/image_part_015.png'],*/
            numCards: [],
            teamScore: 0,
            opponentScore: 0,
            currentPlayer: 0,
            history: []
        };
    }

    handleButtonClick(buttonName, event) {
        this.setState({ buttonWasClicked: buttonName });
    }

    handleDisplayHand(){
      	fetch('http://127.0.0.1:5000/start_game')
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          this.setState({message: myJson.status});
          this.setState({handToDisplay: myJson.hand});
          this.setState({numCards: myJson.numCards});
          this.setState({teamScore: myJson.teamScore});
          this.setState({opponentScore: myJson.opponentScore});
          this.setState({currentPlayer: myJson.currentPlayer});
          this.setState({history: myJson.history});
        });
    }

    handleAsk(){
        var card = document.getElementById('card').value;
        var player = document.getElementById('player').value;
      	fetch('http://127.0.0.1:5000/askCard?card=' + card + '&player=' + player)
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          this.setState({message: myJson.status});
          this.setState({handToDisplay: myJson.hand});
          this.setState({numCards: myJson.numCards});
          this.setState({teamScore: myJson.teamScore});
          this.setState({opponentScore: myJson.opponentScore});
          this.setState({currentPlayer: myJson.currentPlayer});
          this.setState({history: myJson.history});
        });
    }

    handleDeclare(){
        var halfSuit = document.getElementById('half-suit').value;
        var id1 = document.getElementById('id1').value;
        var id2 = document.getElementById('id2').value;
        var id3 = document.getElementById('id3').value;
        var id4 = document.getElementById('id4').value;
        var id5 = document.getElementById('id5').value;
        var id6 = document.getElementById('id6').value;
        fetch('http://127.0.0.1:5000/declareSuit?suit=' + halfSuit
         + '&id1=' + id1
         + '&id2=' + id2
         + '&id3=' + id3
         + '&id4=' + id4
         + '&id5=' + id5
         + '&id6=' + id6
         )
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          this.setState({message: myJson.status});
          this.setState({handToDisplay: myJson.hand});
          this.setState({numCards: myJson.numCards});
          this.setState({teamScore: myJson.teamScore});
          this.setState({opponentScore: myJson.opponentScore});
          this.setState({currentPlayer: myJson.currentPlayer});
          this.setState({history: myJson.history});
        });
    }

    handlePass(){
        var teammate = document.getElementById('teammate').value;
      	fetch('http://127.0.0.1:5000/passTurn?teammate=' + teammate)
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          this.setState({message: myJson.status});
          this.setState({handToDisplay: myJson.hand});
          this.setState({numCards: myJson.numCards});
          this.setState({teamScore: myJson.teamScore});
          this.setState({opponentScore: myJson.opponentScore});
          this.setState({currentPlayer: myJson.currentPlayer});
          this.setState({history: myJson.history});
        });
    }

    render(){
        let cards = [];
        for (let i = 0; i < this.state.handToDisplay.length; i++){
            var card = require('' + this.state.handToDisplay[i]);
            cards[i] = <img key={i}
                            src={card}
                            width="30px"
                            height="auto"
                            />
        }

        let history = [];
        for (let i = 0; i < this.state.history.length; i++){
            history.push(<li className="history-li" key={this.state.history[i]}>{this.state.history[this.state.history.length - i - 1]}</li>);
        }

        return(
            <div id="parent">
                <div class="grid-container">
                  <div class="header">
                    <br/>
                    FISH
                  </div>
                  <div class="item2"></div>
                  <div class="item3">
                      <div id="circle">
                        <div id="small-circle">
                            <div id="smaller-circle">
                                <div id="smallest-circle">
                                    <div class="player3">{this.state.numCards[3]}</div>
                                    <div class="player4">{this.state.numCards[4]}</div>
                                    <div class="player5">{this.state.numCards[5]}</div>
                                    <div class="player1">{this.state.numCards[1]}</div>
                                    <div class="player0">
                                        {cards}
                                    </div>
                                    <div class="player2">{this.state.numCards[2]}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="item4">
                    <button type="button" id="ask" onClick={e => this.handleButtonClick('ask', e)}>Ask!</button>
                    <button type="button" id="declare" onClick={e => this.handleButtonClick('declare', e)}>Declare!</button>
                    <button type="button" id="pass" onClick={e => this.handleButtonClick('pass', e)}>Pass!</button>
                      {
                      this.state.buttonWasClicked === 'ask'
                      &&
                      <div>
                        <div>
                            <input id="card" placeholder="Card"/>
                        </div>
                        <div>
                            <input id="player" placeholder="Player"/>
                        </div>
                        <div>
                            <button type="button" id="submit-ask" onClick={() => this.handleAsk()}>Submit</button>
                        </div>
                      </div>
                      }
                      {
                      this.state.buttonWasClicked === 'declare'
                      &&
                      <div>
                        <div>
                            <input id="half-suit" placeholder="Half Suit"/>
                        </div>
                        <div>
                            <input id="id1" placeholder="C1"/>
                        </div>
                        <div>
                            <input id="id2" placeholder="C2"/>
                        </div>
                        <div>
                            <input id="id3" placeholder="C3"/>
                        </div>
                        <div>
                            <input id="id4" placeholder="C4"/>
                        </div>
                        <div>
                            <input id="id5" placeholder="C5"/>
                        </div>
                        <div>
                            <input id="id6" placeholder="C6"/>
                        </div>
                        <div>
                            <button type="button" id="submit-declare" onClick={() => this.handleDeclare()}>Submit</button>
                        </div>
                    </div>
                    }
                    {
                    this.state.buttonWasClicked === 'pass'
                    &&
                    <div>
                        <div>
                            <input id="teammate" placeholder="Teammate"/>
                        </div>
                        <div>
                            <button type="button" id="submit-pass" onClick={() => this.handlePass()}>Submit</button>
                        </div>
                    </div>
                    }
                  </div>
                  <div class="item5">
                      <div class="score">{this.state.opponentScore}</div>
                  </div>
                  <div class="item6">
                      <div class="score">{this.state.teamScore}</div>
                  </div>
                </div>
                <p>
                    message:
                    {this.state.message},
                    number of cards:
                    {this.state.numCards},
                    current player:
                    {this.state.currentPlayer}
                </p>
                <p>
                    History:
                    <ul>{history}</ul>
                </p>
                <div id="instructions">
                    <button type="button" onClick={() => this.handleDisplayHand()}>Start Game</button>
                </div>
            </div>
        )
    }
}

export default Fish;