import { firestore, query, collection, getDocs, where, setDoc, doc, increment, updateDoc } from "../../scripts/init-firebase.js";
import React from 'react';
import Badge from '@material-ui/core/Badge';
import './Fish.css';

import Header from './Header';
import Score, {TeamScore, OpponentScore} from './Score';
import {ActionMenu} from './ActionMenu';

class Fish extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            random: 0,
            name: '',
            names: [],
            game_id: "fish",
            playerName: "",
            playersConnected: 0,
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
                       6: [0, 2, 3, 4, 5, 1],
                       0: [1, 2, 3, 4, 5, 0],
                       1: [0, 2, 3, 4, 5, 1],
                       2: [0, 1, 3, 4, 5, 2],
                       3: [4, 5, 0, 1, 2, 3],
                       4: [3, 5, 0, 1, 2, 4],
                       5: [3, 4, 0, 1, 2, 5]
                      }
            
        };
        this.handleAsk = this.handleAsk.bind(this);
        this.handleDeclare = this.handleDeclare.bind(this);
        this.handlePass = this.handlePass.bind(this);
    }

    componentWillUnmount() {
        // Update Player Base Information
        const playerbase_query = query(collection(firestore, "playerbase"), where("game_id", "==", this.state.game_id));
        getDocs(playerbase_query).then((playerbase_snapshot) => {
            playerbase_snapshot.forEach((snapshot) => {
                let game_id = snapshot.data().game_id;
                // Add Information to database
                const playerbase_object = {
                    game_id: game_id,
                    num_players: snapshot.data().num_players - 1
                };
                setDoc(doc(firestore, "playerbase", game_id), playerbase_object).then((response) => {
                    console.log(response);
                }).catch((err) => {
                    console.log(err);
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount(){
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            // Add Information to database
            const playerbase_object = {
                game_id: this.state.game_id,
                num_players: increment(-1)
            };
            updateDoc(doc(firestore, "playerbase", this.state.game_id), playerbase_object).then((response) => {
                console.log(response);
            }).catch((err) => {
                console.log(err);
            });
            e.returnValue = "";
        });

        // Update Player Base Information
        const playerbase_query = query(collection(firestore, "playerbase"), where("game_id", "==", this.state.game_id));
        getDocs(playerbase_query).then((playerbase_snapshot) => {
            playerbase_snapshot.forEach((snapshot) => {
                let game_id = snapshot.data().game_id;
                // Add Information to database
                const playerbase_object = {
                    game_id: game_id,
                    num_players: snapshot.data().num_players + 1
                };
                setDoc(doc(firestore, "playerbase", game_id), playerbase_object).then((response) => {
                    console.log(response);
                }).catch((err) => {
                    console.log(err);
                });
            });
        }).catch((err) => {
            console.log(err);
        });

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
            var playerID = data.playerID;
            var join_key = data.join_key;
            var status = data.status;
            var names = data.names;
            var playersConnected = data.names_count;

            if (playerID) {this.setState({playerID: playerID});}
            if (hand) { this.setState({handToDisplay: hand});}
            if (game) { this.setState({gameStarted: true}); }
            if (numCards) {this.setState({numCards: numCards});}
            if (teamScore) {this.setState({teamScore: teamScore});}
            if (opponentScore) {this.setState({opponentScore: opponentScore});}
            if (history) {this.setState({history: history});}
            if (names) {this.setState({names: names, playersConnected: playersConnected, currentPlayer:currentPlayer});}
            if (status) {this.setState({status: status});}
            if (join_key) {
               var roomCode = document.getElementById("room-code");
               roomCode.innerHTML = "Room Code: " + join_key;
               {this.setState({roomCode: join_key});}
            }
        }
    }


    browser2server() {
        const toServer = document.getElementById("textbox").value;
        this.state.websocket.send(JSON.stringify(toServer));
    }

    createGame() {
        const hostName = document.getElementById("host-name").value;
        this.setState( {name: hostName} )
        if (hostName !== '') {
            this.state.websocket.send(JSON.stringify('{"type":"createGame", "name":"' + hostName + '"}'));
            this.setState({ gameExists: true });
        }
    }

    joinGame() {
        const key = document.getElementById("join").value;
        this.state.websocket.send(JSON.stringify('{"type":"joinGame","join_key":"' + key + '","name":"' + this.state.name + '"}'));
        this.setState({ gameExists: true });
        this.setState({ waitingForHost: true });
    }

    takeSeat(seat){
        this.state.websocket.send(JSON.stringify('{"type":"takeASeat", "name":"' + this.state.name + '","seat_id":"' + seat + '"}'));
        console.log("Took Seat: " + seat );
    }

    startGame() {
        this.state.websocket.send(JSON.stringify('{"type":"startGame"}'));
        this.setState({ gameStarted: true});
    }

    handleButtonClick(buttonName, event) {
        if (buttonName === 'join'){
            const name = document.getElementById("host-name").value;
            this.setState( {name: name} )
        }
        this.setState({ buttonWasClicked: buttonName });
    }

    clearInputs(){
        var elements = document.getElementsByTagName("input");
        for (var i=0; i < elements.length; i++) { if (elements[i].type == "text") { elements[i].value = ""; } }
    }

    handleAsk(){
        var suit = document.getElementsByName("suits")[0].value;
        var rank = document.getElementsByName("ranks")[0].value;
        var card = suit + rank;
        var player = document.getElementsByName("players")[0].value;
        if (suit && rank && player){
            this.state.websocket.send(JSON.stringify('{"type":"askCard","card":"' + card + '","player":"' + player + '"}'));
        }
        this.clearInputs();
    }

    handleDeclare(){
        var suit = document.getElementsByName("suits")[0].value;
        var id1 = document.getElementById('id1').value;
        var id2 = document.getElementById('id2').value;
        var id3 = document.getElementById('id3').value;
        var id4 = document.getElementById('id4').value;
        var id5 = document.getElementById('id5').value;
        var id6 = document.getElementById('id6').value;
        if (suit && id1 && id2 && id3 && id4 && id5 && id6) {
            this.state.websocket.send(JSON.stringify('{"type":"declareSuit","suit":"' + suit + '","id1":"' + id1 + '","id2":"' + id2 + '","id3":"' + id3 + '","id4":"' + id4 + '","id5":"' + id5 + '","id6":"' + id6 + '"}'));
        }
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

        let opponents = [];
        for (let i = 2; i < 5; i++){
            opponents.push(<option className="white" id={this.state.currentPlayer === i + 1 ? "turn" : "not-turn"} key={i} value={this.state.teamMap[this.state.playerID][i]}>{this.state.names[this.state.teamMap[this.state.playerID][i]]}</option>)
        }

        let teammates = [<option className="white"  key={3} value={this.state.playerID}>{this.state.names[this.state.playerID]}</option>];
        for (let i = 0; i < 2; i ++){
            teammates.push(<option className="white" id={this.state.currentPlayer === i ? "turn" : "not-turn"} key={i + 1} value={this.state.teamMap[this.state.playerID][i]}>{this.state.names[this.state.teamMap[this.state.playerID][i]]}</option>)
        }

        const styles = theme => ({
            margin: {
              margin: theme.spacing.unit * 2,
            }
        });

        return(
                <div className="container">
                    <Header />
                    <TeamScore score={this.state.teamScore}/>
                    <OpponentScore score={this.state.opponentScore}/>
                    <ActionMenu
                        gameStarted = {this.state.gameStarted}
                        message = {this.state.message}
                        currentPlayer = {this.state.currentPlayer}
                        player = {this.state.playerID}
                        teammates = {teammates}
                        opponents = {opponents}
                        handleAsk = {this.handleAsk}
                        handleDeclare = {this.handleDeclare}
                        handlePass = {this.handlePass}
                    />


                    <div className="table-4">
                        <div className="table-3">
                            <div className="table-2">
                                <div className="table">
                                    <div className="cards">
                                        <br/>
                                        {cards}
                                    </div>
                                    <div className="seats">
                                        {this.state.gameExists && !this.state.gameStarted &&
                                        <div className="seat-main-button">
                                            <button type="button" disabled={this.state.names[1]} onClick={() => this.takeSeat(1)}>Team 1</button>
                                            <br/>
                                            {this.state.names[1]}
                                        </div>
                                        }
                                        {this.state.gameStarted &&
                                        <div className="seat-main">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[this.state.playerID]}  color="primary" showZero>
                                                    <img id={this.state.currentPlayer === this.state.playerID ? "turn" : "not-turn"} className="icon" src={require('../../assets/images/blue-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                {this.state.names[this.state.teamMap[this.state.playerID][5]]}
                                            </div>
                                        </div>
                                        }
                                        {this.state.gameExists && !this.state.gameStarted &&
                                        <div className="seat-1-button">
                                            <button type="button" disabled={this.state.names[3]} onClick={() => this.takeSeat(3)}>Team 2</button>
                                            <br/>
                                            {this.state.names[3]}
                                        </div>
                                        }
                                        {this.state.gameStarted &&
                                        <div className="seat-1">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[this.state.teamMap[this.state.playerID][2]]} color="primary" showZero>
                                                    <img id={this.state.currentPlayer === this.state.teamMap[this.state.playerID][2] ? "turn" : "not-turn"} className="icon" src={require('../../assets/images/red-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                {this.state.names[this.state.teamMap[this.state.playerID][2]]}
                                            </div>
                                        </div>
                                        }
                                        {this.state.gameExists && !this.state.gameStarted &&
                                        <div className="seat-2-button">
                                            <button type="button" disabled={this.state.names[4]} onClick={() => this.takeSeat(4)}>Team 2</button>
                                            <br/>
                                            {this.state.names[4]}
                                        </div>
                                        }
                                        {this.state.gameStarted &&
                                        <div className="seat-2">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[this.state.teamMap[this.state.playerID][3]]} color="primary" showZero>
                                                    <img id={this.state.currentPlayer === this.state.teamMap[this.state.playerID][3] ? "turn" : "not-turn"} className="icon" src={require('../../assets/images/red-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                {this.state.names[this.state.teamMap[this.state.playerID][3]]}
                                            </div>
                                        </div>
                                        }
                                        {this.state.gameExists && !this.state.gameStarted &&
                                        <div className="seat-3-button">
                                            <button type="button" disabled={this.state.names[5]} onClick={() => this.takeSeat(5)}>Team 2</button>
                                            <br/>
                                            {this.state.names[5]}
                                        </div>
                                        }
                                        {this.state.gameStarted &&
                                        <div className="seat-3">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[this.state.teamMap[this.state.playerID][4]]} color="primary" showZero>
                                                    <img id={this.state.currentPlayer === this.state.teamMap[this.state.playerID][4] ? "turn" : "not-turn"} className="icon" src={require('../../assets/images/red-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                {this.state.names[this.state.teamMap[this.state.playerID][4]]}
                                            </div>
                                        </div>
                                        }
                                        {this.state.gameExists && !this.state.gameStarted &&
                                        <div className="seat-4-button">
                                            <button type="button" disabled={this.state.names[0]} onClick={() => this.takeSeat(0)}>Team 1</button>
                                            <br/>
                                            {this.state.names[0]}
                                        </div>
                                        }
                                        {this.state.gameStarted &&
                                        <div className="seat-4">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[this.state.teamMap[this.state.playerID][0]]} color="primary" showZero>
                                                    <img id={this.state.currentPlayer === this.state.teamMap[this.state.playerID][0] ? "turn" : "not-turn"} className="icon" src={require('../../assets/images/blue-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                {this.state.names[this.state.teamMap[this.state.playerID][0]]}
                                            </div>
                                        </div>
                                        }
                                        {this.state.gameExists && !this.state.gameStarted &&
                                        <div className="seat-5-button">
                                            <button type="button" disabled={this.state.names[2]} onClick={() => this.takeSeat(2)}>Team 1</button>
                                            <br/>
                                            {this.state.names[2]}
                                        </div>
                                        }
                                        {this.state.gameStarted &&
                                        <div className="seat-5">
                                            <div className="player-pic">
                                                <Badge badgeContent={this.state.numCards[this.state.teamMap[this.state.playerID][1]]} color="primary" showZero>
                                                    <img id={this.state.currentPlayer === this.state.teamMap[this.state.playerID][1] ? "turn" : "not-turn"} className="icon" src={require('../../assets/images/blue-icon.png')}/>
                                                </Badge>
                                            </div>
                                            <div className="player-name">
                                                <br/>
                                                {this.state.names[this.state.teamMap[this.state.playerID][1]]}
                                            </div>
                                        </div>
                                        }
                                     </div>
                                    {!this.state.gameStarted &&
                                    <div className="start">
                                        { !(this.state.buttonWasClicked === 'join') && !(this.state.gameExists) &&
                                        <input type="text" className="textbox" placeholder="Name" id="host-name" value={this.state.playerName} onChange={e => this.setState({ playerName: e.target.value })}/>
                                        }
                                        <br/>
                                        {!this.state.gameExists && !(this.state.buttonWasClicked === 'join') &&
                                            <div className="create-game">
                                                <button type="button" id="create-game-button" disabled={!this.state.playerName} onClick={() => this.createGame()}>Create Game!</button>
                                                <br/><br/>
                                            </div>
                                        }
                                        {!this.state.gameExists &&
                                            <div className="join-game">
                                                    {!(this.state.buttonWasClicked === 'join') &&
                                                    <div>
                                                        <button type="button" id="join-game-button" disabled={!this.state.playerName} onClick={(e) => this.handleButtonClick('join', e)}>Join Game!</button>
                                                    </div>
                                                    }
                                                {this.state.buttonWasClicked === 'join' &&
                                                    <div>
                                                        <input type="text" className="textbox" placeholder="Room Code" id="join"/>
                                                        <br/><br/>
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
                                                            <p id="room-code" /* onClick={()=> this.copyRoomCode()}*/></p>
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