import React from 'react';
import Badge from '@material-ui/core/Badge';
import './Fish.css';
import useSound from 'use-sound';


class Fish extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            playersConnected: 1,
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
            gameExists: false,
            teamMap: {
                       0: [1, 2, 3, 4, 5],
                       1: [0, 2, 3, 4, 5],
                       2: [0, 1, 3, 4, 5],
                       3: [4, 5, 0, 1, 2],
                       4: [3, 5, 0, 1, 2],
                       5: [3, 4, 0, 1, 2]
                      }
        };
    }

    componentDidMount(){
        this.state.websocket.onopen = () => {
            console.log('connected')
        }
        this.state.websocket.onmessage = evt => {
            const data = JSON.parse(evt.data)

            console.log(data);

            var hand = data.hand;
            var game = data.game;
            var numCards = data.numCards;
            var teamScore = data.teamScore;
            var opponentScore = data.opponentScore;
            var history = data.history;
            var currentPlayer = data.currentPlayer;
            var playerID = data.playerID;
            var join_key = data.join_key;
            var status = data.status;
            if (hand) { this.setState({handToDisplay: hand});}
            if (game) { this.setState({gameStarted: true}); }
            if (numCards) {this.setState({numCards: numCards});}
            if (teamScore) {this.setState({teamScore: teamScore});}
            if (opponentScore) {this.setState({opponentScore: opponentScore});}
            if (history) {this.setState({history: history});}
            if (playerID) {this.setState({playerID: playerID});}
            if (currentPlayer) {this.setState({currentPlayer: currentPlayer});}
            if (status) {this.setState({status: status});}
            if (join_key) {
               var roomCode = document.getElementById("room-code");
               roomCode.innerHTML = "Room Code: " + join_key;
               {this.setState({roomCode: join_key});}
            }
            if (data.player_joined){
                {this.setState({playersConnected: this.state.playersConnected + 1})}
            }
        }
    }


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
        const name = document.getElementById("name").value;
        this.state.websocket.send(JSON.stringify('{"type":"joinGame","join_key":"' + key + '","name":"' + name + '"}'));
        this.setState({ gameExists: true });
        this.setState({ waitingForHost: true });
    }

    startGame() {
        const hostName = document.getElementById("host-name").value;
        this.state.websocket.send(JSON.stringify('{"type":"startGame", "name":"' + hostName + '"}'));
        this.setState({ gameStarted: true});
    }

    handleButtonClick(buttonName, event) {
        this.setState({ buttonWasClicked: buttonName });
    }

    clearInputs(){
        var elements = document.getElementsByTagName("input");
        for (var i=0; i < elements.length; i++) { if (elements[i].type == "text") { elements[i].value = ""; } }
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
        this.state.websocket.send(JSON.stringify('{"type":"declareSuit","suit":"' + halfSuit + '","id1":"' + id1 + '","id2":"' + id2 + '","id3":"' + id3 + '","id4":"' + id4 + '","id5":"' + id5 + '","id6":"' + id6 + '"}'));
        this.clearInputs();
    }

    handlePass(){
        var teammate = document.getElementById('teammate').value;
        this.state.websocket.send(JSON.stringify('{"type":"passTurn","teammate":"' + teammate + '"}'));
        this.clearInputs();
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

        const styles = theme => ({
            margin: {
              margin: theme.spacing.unit * 2,
            }
        });

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
                                        <br/>
                                        {cards}
                                    </div>
                                    {this.state.gameStarted &&
                                    <div className="seats">
                                        <div className="seat-1">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[3]} color="primary" showZero>
                                                    <img className="icon" src={require('../../assets/images/red-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                Player {this.state.teamMap[this.state.playerID][2]}
                                            </div>
                                        </div>
                                        <div className="seat-2">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[4]} color="primary" showZero>
                                                    <img className="icon" src={require('../../assets/images/red-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                Player {this.state.teamMap[this.state.playerID][3]}
                                            </div>
                                        </div>
                                        <div className="seat-3">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[5]} color="primary" showZero>
                                                    <img className="icon" src={require('../../assets/images/red-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                Player {this.state.teamMap[this.state.playerID][4]}
                                            </div>
                                        </div>
                                        <div className="seat-4">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[1]} color="primary" showZero>
                                                    <img className="icon" src={require('../../assets/images/blue-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                Player {this.state.teamMap[this.state.playerID][0]}
                                            </div>
                                        </div>
                                        <div className="seat-5">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[2]} color="primary" showZero>
                                                    <img className="icon" src={require('../../assets/images/blue-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                Player {this.state.teamMap[this.state.playerID][1]}
                                            </div>
                                        </div>
                                     </div>
                                    }
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
                                                        <br/><br/>
                                                        <input type="text" className="textbox" placeholder="Name" id="name"/>

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
                                                        <input type="text" className="textbox" placeholder="Name" id="host-name"/>
                                                        <br/><br/>
                                                        <button type="button" id="start-game-button" onClick={() => this.startGame()}>Start Game!</button>
                                                        <br/><br/>
                                                        <div>
                                                            <p id="room-code" onClick={()=> this.copyRoomCode()}></p>
                                                            <br/>
                                                            <p style={{color: "white"}}>Players: {this.state.playersConnected} / 6 </p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {this.state.waitingForHost &&
                                            <h2 className="loading">Waiting for host to start game</h2>
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
        )
    }
}

export default Fish;