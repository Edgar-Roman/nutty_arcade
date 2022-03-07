import React from 'react';
import './Fish.css';


class Fish extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            waitingForHost: false,
            roomCode: 0,
            playerID: 0,
            gameStarted: false,
            buttonWasClicked: '',
            message: '',
            handToDisplay: [],
            numCards: [0, 0, 0, 0, 0, 0],
            teamScore: 0,
            opponentScore: 0,
            currentPlayer: 0,
            history: [],
            websocket: new WebSocket("ws://localhost:5000/"),
            gameExists: false
        };
    }

    componentDidMount(){
        this.state.websocket.onopen = () => {
            console.log('connected')
        }
        this.state.websocket.onmessage = evt => {
            const data = JSON.parse(evt.data)
            var hand = data.hand;
            var game = data.game;
            var numCards = data.numCards;
            var teamScore = data.teamScore;
            var opponentScore = data.opponentScore;
            var history = data.history;
            var currentPlayer = data.currentPlayer;
            var playerID = data.playerID
            var join_key = data.join_key
            if (hand) { this.setState({handToDisplay: hand});}
            if (game) { this.setState({gameStarted: true}); }
            if (numCards) {this.setState({numCards: numCards});}
            if (teamScore) {this.setState({teamScore: teamScore});}
            if (opponentScore) {this.setState({opponentScore: opponentScore});}
            if (history) {this.setState({history: history});}
            if (playerID) {this.setState({playerID: playerID});}
            if (currentPlayer) {this.setState({currentPlayer: currentPlayer});}
            if (join_key) {
               var roomCode = document.getElementById("room-code");
               roomCode.innerHTML = "Room Code: " + join_key;
               {this.setState({roomCode: join_key});}
            }
            console.log(JSON.stringify(data))
        }
    }

//     this.websocket.addEventListener("message", ({data}) => {
//         const fromServer = JSON.parse(data);
//         document.getElementById("output").innerHTML = JSON.stringify(fromServer);
//     });

    browser2server() {
        const toServer = document.getElementById("textbox").value;
        this.state.websocket.send(JSON.stringify(toServer));
    }

    createGame() {
        this.state.websocket.send(JSON.stringify('{"type":"createGame"}'));
        this.setState({ gameExists: true });
    }

    copyRoomCode() {
        navigator.clipboard.writeText(this.state.roomCode);
        alert("Room code copied to clipboard!")
    }

    joinGame() {
        const key = document.getElementById("join").value;
        console.log('{"type":"joinGame","join_key":' + key + '}');
        this.state.websocket.send(JSON.stringify('{"type":"joinGame","join_key":"' + key + '"}'));
        this.setState({ gameExists: true });
        this.setState({ waitingForHost: true });
    }

    startGame() {
        this.state.websocket.send(JSON.stringify('{"type":"startGame"}'));
        this.setState({ gameStarted: true});
    }



    handleButtonClick(buttonName, event) {
        this.setState({ buttonWasClicked: buttonName });
    }

    clearInputs(){
        var elements = document.getElementsByTagName("input");
        for (var i=0; i < elements.length; i++) { if (elements[i].type == "text") { elements[i].value = ""; } }
    }

    handleDisplayHand(){
      	fetch('http://127.0.0.1:5000/start_game')
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          console.log(myJson.hand)
          this.setState({gameStarted: true});
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
        this.state.websocket.send(JSON.stringify('{"type":"askCard","card":"' + card + '","player":"' + player + '"}'));
        this.clearInputs();
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
          console.log(myJson.hand);
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
          console.log(myJson.hand);
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
                            width="10%"
                            height="auto"
                            style={{marginRight:5}}
                            />
        }

        let history = [];
        for (let i = 0; i < this.state.history.length; i++){
            history.push(<li className="history-li" key={this.state.history[i]}>{this.state.history[this.state.history.length - i - 1]}</li>);
        }
        return(
                <div className="container">
                    <div className="score-1">
                        <h3>{this.state.opponentScore}</h3>
                    </div>
                    <div className="score-2">
                        <h3>{this.state.teamScore}</h3>
                    </div>
                    <div className="header">
                        <h1>FISH</h1>
                    </div>
                    <div className="table-4">
                        <div className="table-3">
                            <div className="table-2">
                                <div className="table">
                                    <div className="cards">
                                        {cards}
                                    </div>
                                    <div className="seat-1">
                                        <div className="player-pic">
                                            <img className="icon" src={require('../../assets/images/icon.png')}/>
                                        </div>
                                        <div className="player-name">
                                            <br/>
                                            Player 3
                                        </div>
                                    </div>
                                    <div className="seat-2">
                                        SEAT
                                    </div>
                                    <div className="seat-3">
                                        SEAT
                                    </div>
                                    <div className="seat-4">
                                        SEAT
                                    </div>
                                    <div className="seat-5">
                                        SEAT
                                    </div>
                                    {!this.state.gameStarted &&
                                    <div className="start">
                                        {!this.state.gameExists &&
                                            <div className="create-game">
                                                <button type="button" id="create-game-button" onClick={() => this.createGame()}>Create Game!</button>
                                                <br/><br/>
                                            </div>
                                        }
                                        {!this.state.gameExists &&
                                            <div className="join-game">
                                                    <button type="button" id="join-game-button" onClick={(e) => this.handleButtonClick('join', e)}>Join Game!</button>
                                                {this.state.buttonWasClicked == 'join' &&
                                                    <div>
                                                        <br/>
                                                        <input type="text" className="textbox" placeholder="Room Code" id="join"/>
                                                        <input type="button" value="Join!" style={{cursor:'pointer'}} onClick={() => this.joinGame()}/>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {this.state.gameExists && !this.state.waitingForHost &&
                                            <div className="start-game">
                                                {!this.state.gameStarted &&
                                                    <div>
                                                        <button type="button" id="start-game-button" onClick={() => this.startGame()}>Start Game!</button>
                                                        <br/><br/>
                                                        <div>
                                                            <p id="room-code" onClick={()=> this.copyRoomCode()}></p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {this.state.waitingForHost &&
                                            <h2>Waiting for host to start game...</h2>
                                        }
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="menu">
                            <button type="button" disabled={!(this.state.playerID === this.state.currentPlayer && this.state.gameStarted)} className="ask" onClick={e => this.handleButtonClick('ask', e)}>Ask!</button>
                            <button type="button" disabled={!(this.state.playerID === this.state.currentPlayer && this.state.gameStarted)} className="declare" onClick={e => this.handleButtonClick('declare', e)}>Declare!</button>
                            <button type="button" disabled={!(this.state.playerID === this.state.currentPlayer && this.state.gameStarted)} className="pass" onClick={e => this.handleButtonClick('pass', e)}>Pass!</button>
                              {this.state.buttonWasClicked === 'ask'
                              &&
                              <div className="input">
                                <div>
                                    <input id="card" placeholder="Card"/>
                                </div>
                                <div>
                                    <input id="player" placeholder="Player"/>
                                </div>
                                <div>
                                    <br/>
                                    <button type="button" id="submit-ask" onClick={() => this.handleAsk()}>Submit</button>
                                </div>
                                <p>{this.state.message}</p>
                              </div>
                              }
                              {
                              this.state.buttonWasClicked === 'declare'
                              &&
                              <div className="input">
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
                                    <br/>
                                    <button type="button" id="submit-declare" onClick={() => this.handleDeclare()}>Submit</button>
                                </div>
                                <p>{this.state.message}</p>
                            </div>
                            }
                            {
                            this.state.buttonWasClicked === 'pass'
                            &&
                            <div className="input">
                                <div>
                                    <input id="teammate" placeholder="Teammate"/>
                                </div>
                                <div>
                                    <br/>
                                    <button type="button" id="submit-pass" onClick={() => this.handlePass()}>Submit</button>
                                </div>
                                <p>{this.state.message}</p>
                            </div>
                            }
                          </div>
                          <div className="history">
                            <div className="history-header">
                                <u>History</u>
                            </div>
                            <div className="last-action">
                                {this.state.history[this.state.history.length - 1]}
                            </div>
                          </div>
                    </div>


// {/*             <div id="parent"> */}
// {/*                 <div className="grid-container"> */}
// {/*                   <div className="header"> */}
// {/*                     <br/> */}
// {/*                     FISH */}
// {/*                   </div> */}
// {/*                   <div className="item2"> */}
// {/*                     { */}
// {/*                     !this.state.gameStarted */}
// {/*                     && */}
// {/*                     <button type="button" onClick={() => this.handleDisplayHand()}>Start Game</button> */}
// {/*                     } */}
// {/*                     { */}
// {/*                     this.state.gameStarted */}
// {/*                     && */}
// {/*                     <p>Current Player: {this.state.currentPlayer}</p> */}
// {/*                     } */}
// {/*                   </div> */}
// {/*                   <div className="item3"> */}
// {/*                       <div id="circle"> */}
// {/*                         <div id="small-circle"> */}
// {/*                             <div id="smaller-circle"> */}
// {/*                                 <div id="smallest-circle"> */}
// {/*                                     <div className="player"> */}
// {/*                                         <div className="player-pic"> */}
// {/*                                             <img className="icon" src={require('../../assets/images/icon.png')}/> */}
// {/*                                         </div> */}
// {/*                                         <div className="player-id"> */}
// {/*                                             Player: 3 */}
// {/*                                         </div> */}
// {/*                                         <div className="player-cards"> */}
// {/*                                             Num Cards: {this.state.numCards[3]} */}
// {/*                                         </div> */}
// {/*                                     </div> */}
// {/*                                     <div className="player"> */}
// {/*                                         <div className="player-pic"> */}
// {/*                                             <img className="icon" src={require('../../assets/images/icon.png')}/> */}
// {/*                                         </div> */}
// {/*                                         <div className="player-id"> */}
// {/*                                             Player: 4 */}
// {/*                                         </div> */}
// {/*                                         <div className="player-cards"> */}
// {/*                                             Num Cards: {this.state.numCards[4]} */}
// {/*                                         </div> */}
// {/*                                     </div> */}
// {/*                                     <div className="player"> */}
// {/*                                         <div className="player-pic"> */}
// {/*                                             <img className="icon" src={require('../../assets/images/icon.png')}/> */}
// {/*                                         </div> */}
// {/*                                         <div className="player-id"> */}
// {/*                                             Player: 5 */}
// {/*                                         </div> */}
// {/*                                         <div className="player-cards"> */}
// {/*                                             Num Cards: {this.state.numCards[5]} */}
// {/*                                         </div> */}
// {/*                                     </div> */}
// {/*                                     <div className="player"> */}
// {/*                                         <div className="player-pic"> */}
// {/*                                             <img className="icon" src={require('../../assets/images/icon.png')}/> */}
// {/*                                         </div> */}
// {/*                                         <div className="player-id"> */}
// {/*                                             Player: 1 */}
// {/*                                         </div> */}
// {/*                                         <div className="player-cards"> */}
// {/*                                             Num Cards: {this.state.numCards[1]} */}
// {/*                                         </div> */}
// {/*                                     </div> */}
// {/*                                     <div className="player0"> */}
// {/*                                         {cards} */}
// {/*                                     </div> */}
// {/*                                     <div className="player"> */}
// {/*                                         <div className="player-pic"> */}
// {/*                                             <img className="icon" src={require('../../assets/images/icon.png')}/> */}
// {/*                                         </div> */}
// {/*                                         <div className="player-id"> */}
// {/*                                             Player: 2 */}
// {/*                                         </div> */}
// {/*                                         <div className="player-cards"> */}
// {/*                                             Num Cards: {this.state.numCards[2]} */}
// {/*                                         </div> */}
// {/*                                     </div> */}
// {/*                                 </div> */}
// {/*                             </div> */}
// {/*                         </div> */}
// {/*                     </div> */}
// {/*                   </div> */}
// {/*                   <div className="item4"> */}
// {/*                     <button type="button" id="ask" onClick={e => this.handleButtonClick('ask', e)}>Ask!</button> */}
// {/*                     <button type="button" id="declare" onClick={e => this.handleButtonClick('declare', e)}>Declare!</button> */}
// {/*                     <button type="button" id="pass" onClick={e => this.handleButtonClick('pass', e)}>Pass!</button> */}
// {/*                       { */}
// {/*                       this.state.buttonWasClicked === 'ask' */}
// {/*                       && */}
// {/*                       <div> */}
// {/*                         <div> */}
// {/*                             <input id="card" placeholder="Card"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="player" placeholder="Player"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <button type="button" id="submit-ask" onClick={() => this.handleAsk()}>Submit</button> */}
// {/*                         </div> */}
// {/*                         <p>{this.state.message}</p> */}
// {/*                       </div> */}
// {/*                       } */}
// {/*                       { */}
// {/*                       this.state.buttonWasClicked === 'declare' */}
// {/*                       && */}
// {/*                       <div> */}
// {/*                         <div> */}
// {/*                             <input id="half-suit" placeholder="Half Suit"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="id1" placeholder="C1"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="id2" placeholder="C2"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="id3" placeholder="C3"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="id4" placeholder="C4"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="id5" placeholder="C5"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <input id="id6" placeholder="C6"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <button type="button" id="submit-declare" onClick={() => this.handleDeclare()}>Submit</button> */}
// {/*                         </div> */}
// {/*                         <p>{this.state.message}</p> */}
// {/*                     </div> */}
// {/*                     } */}
// {/*                     { */}
// {/*                     this.state.buttonWasClicked === 'pass' */}
// {/*                     && */}
// {/*                     <div> */}
// {/*                         <div> */}
// {/*                             <input id="teammate" placeholder="Teammate"/> */}
// {/*                         </div> */}
// {/*                         <div> */}
// {/*                             <button type="button" id="submit-pass" onClick={() => this.handlePass()}>Submit</button> */}
// {/*                         </div> */}
// {/*                         <p>{this.state.message}</p> */}
// {/*                     </div> */}
// {/*                     } */}
// {/*                   </div> */}
// {/*                   <div className="item5"> */}
// {/*                       <div className="score">{this.state.opponentScore}</div> */}
// {/*                   </div> */}
// {/*                   <div className="item6"> */}
// {/*                       <div className="score">{this.state.teamScore}</div> */}
// {/*                   </div> */}
// {/*                   <div className="item7"> */}
// {/*                   <p> History: </p> */}
// {/*                       <div className="scroll"> */}
// {/*                         <ul>{history}</ul> */}
// {/*                       </div> */}
// {/*                   </div> */}
// {/*                 </div> */}
// {/*                 <h2>Websocket Demo</h2> */}
// {/*                 <input type="text" name="browser2server" className="textbox" defaultValue="" id="textbox"/> */}
// {/*                 <input type="button" value="submit" onClick={() => this.browser2server()}/> */}
//
// {/*                 <p id="output label">Output below:</p> */}
// {/*                 <p id="output"></p> */}
// {/*             </div> */}
        )
    }
}

export default Fish;