import React from 'react';
import './Fish.css';

class Fish extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            handToDisplay: ['./cards/image_part_001.png', './cards/image_part_015.png'],
            buttonWasClicked: '',
            message: '',
            teamScore: 0,
            opponentsScore: 0
        };
    }

    handleDisplayHand(){
        var cards = document.getElementById('cards').value;
      	fetch('http://127.0.0.1:5000/get_hand?cards=' + cards)
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          console.log(myJson.result)
          this.setState({handToDisplay: myJson.result});
        });
    }

    handleButtonClick(buttonName, event) {
        this.setState({ buttonWasClicked: buttonName });
    }

    handleAsk(){
        var card = document.getElementById('card').value;
        var player = document.getElementById('player').value
      	fetch('http://127.0.0.1:5000/askCard?card=' + card + '&player=' + player)
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          this.setState({message: myJson.result});
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
          this.setState({teamScore: this.state.teamScore + myJson.teamScore});
          this.setState({opponentsScore: this.state.opponentsScore + myJson.opponentsScore});
        });
    }

    handlePass(){
        var teammate = document.getElementById('teammate')
      	fetch('http://127.0.0.1:5000/pass?teammate=' + teammate)
        .then((response) => {
      	    return response.json();
        })
        .then((myJson) => {
          // this.setState({});
        });
    }

    render(){
        let cards = [];
        var width = (100 / this.state.handToDisplay.length).toString() + '%';
        for (let i = 0; i < this.state.handToDisplay.length; i++){
            var card = require('' + this.state.handToDisplay[i]);
            cards[i] = <img key={i}
                            src={card}
                            width="40px"
                            height="auto"
                            />
        }
        return(
            <div id="parent">
                <div id="instructions">
                    <h1> Display Hand </h1>
                    <input id="cards" placeholder="Cards (comma separated)"/>
                    <button type="button" onClick={() => this.handleDisplayHand()}>Display!</button>
                    <br/>
                </div>
                <div id="container">
                    <div id="circle">
                        <div id="small-circle">
                            <div id="smaller-circle">
                                <div id="smallest-circle">
                                    <div id= "player-hand">
                                        {cards}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" id="ask" onClick={e => this.handleButtonClick('ask', e)}>Ask!</button>
                <button type="button" id="declare" onClick={e => this.handleButtonClick('declare', e)}>Declare!</button>
                <button type="button" id="pass" onClick={e => this.handleButtonClick('pass', e)}>Pass!</button>
                <p>
                {
                    this.state.buttonWasClicked === 'ask'
                    &&
                    <span>
                        <input id="card" placeholder="Card"/>
                        <input id="player" placeholder="Player"/>
                        <button type="button" id="submit-ask" onClick={() => this.handleAsk()}>Submit</button>
                    </span>
                }
                {
                    this.state.buttonWasClicked === 'declare'
                    &&
                    <span>
                        <input id="half-suit" placeholder="Half Suit"/>
                        <input id="id1" placeholder="C1"/>
                        <input id="id2" placeholder="C2"/>
                        <input id="id3" placeholder="C3"/>
                        <input id="id4" placeholder="C4"/>
                        <input id="id5" placeholder="C5"/>
                        <input id="id6" placeholder="C6"/>
                        <button type="button" id="submit-declare" onClick={() => this.handleDeclare()}>Submit</button>
                    </span>
                }
                {
                    this.state.buttonWasClicked === 'pass'
                    &&
                    <span>
                        <input id="teammate" placeholder="Teammate"/>
                        <button type="button" id="submit-pass" onClick={() => this.handlePass()}>Submit</button>
                    </span>
                }
                {this.state.message}
                </p>
            </div>
        )
    }
}

export default Fish;