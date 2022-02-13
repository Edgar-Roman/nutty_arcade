// Import React
import React from 'react';

// Import CSS Stylesheet
import "../../styles/main.css";

class Home extends React.Component {
	// Example Constructor
    constructor(props) {
        super(props);
        this.state = {
            example_state: 0
        };
    }

    // Example Method
    handleClick() {
		console.log('this is:', this);
    }

    // Example Render
	render() {
        return (
            <div>
                {/* Page Logo Header */}
                <header>
                    <div id="logo_header">
                        {/* Used by Theme 2 */}
                        <div id="row1" className="header-background"></div>
                        <div id="row2" className="header-background"></div>
                        <div id="row3" className="header-background"></div>
                        <div id="row4" className="header-background"></div>
                        <div id="row5" className="header-background"></div>
                        <div id="row6" className="header-background"></div>
                        <p id="logo">
                            NUTTY ARCADE
                        </p>
                        <div id="log-in-button-container" className="account-button-container">
                            <button id="log-in-button" className="account-button">
                                LOG IN
                            </button>
                        </div>
                        <div id="register-button-container" className="account-button-container">
                            <button id="register-button" className="account-button">
                                REGISTER
                            </button>
                        </div>
                        
                    </div>
                </header>

                <main>
                    <div>
                        {/* Category */}
                    {/* Card Games */}
                    <div className="category-container">
                        <div id="card-games" className="page-category">CARD GAMES</div>
                    </div>
                    
                    {/* Game Browser */}
                    <div id="card-games" className="game-browser">
                        {/* Example Game Module */}
                        {/* Game Wrapper */}
                        <div id="game-fish" className="game">
                            {/* Game Menu */}
                            <div id="fish-menu" className="game-menu">
                                {/* Thumbnail */}
                                <div id="fish-thumbnail" className="thumbnail"></div>
                            </div>
                            {/* Game Information */}
                            <div className="game-information">
                                {/* Title */}
                                <div className="game-title">FISH</div>
                                {/* Play Button */}
                                <div className="button-container">
                                    <button className="play-button">PLAY NOW</button>
                                </div>
                                {/* Player Count */}
                                <div className="player-counter-container">
                                    <div className="player-counter-title">PLAYERS ACTIVE</div>
                                    {/* Replace Below with JS Function */}
                                    <div className="player-counter">
                                        5
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    </div>

                    <div>
                        {/* Board Games */}
                        <div className="category-container">
                            <div id="board-games" className="page-category">BOARD GAMES</div>
                        </div>
                        {/* Games Browser */}
                        <div id="board-games" className="game-browser">
                            {/* Example Game Module */}
                            {/* Game Wrapper */}
                            <div id="game-pioneers" className="game">
                                {/* Game Menu */}
                                <div id="pioneers-menu" className="game-menu">
                                    {/* Thumbnail */}
                                    <div id="pioneers-thumbnail" className="thumbnail"></div>
                                </div>
                                {/* Game Information */}
                                <div className="game-information">
                                    {/* Title */}
                                    <div className="game-title">PIONEERS</div>
                                    {/* Play Button */}
                                    <div className="button-container">
                                        <button className="play-button">PLAY NOW</button>
                                    </div>
                                    {/* Player Count */}
                                    <div className="player-counter-container">
                                        <div className="player-counter-title">PLAYERS ACTIVE</div>
                                        {/* Replace Below with JS Function */}
                                        <div className="player-counter">
                                            15
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        {/* Nutty Casino */}
                        <div className="category-container">
                            <div id="nutty-casino" className="page-category">NUTTY CASINO</div>
                        </div>
                        {/* Games Browser */}
                        <div id="board-games" className="game-browser">
                            {/* Example Game Module */}
                            {/* Game Wrapper */}
                            <div id="game-blackjack" className="game">
                                {/* Game Menu */}
                                <div id="blackjack-menu" className="game-menu">
                                    {/* Thumbnail */}
                                    <div id="fish-thumbnail" className="thumbnail"></div>
                                </div>
                                {/* Game Information */}
                                <div className="game-information">
                                    {/* Title */}
                                    <div className="game-title">BLACKJACK</div>
                                    {/* Play Button */}
                                    <div className="button-container">
                                        <button className="play-button">PLAY NOW</button>
                                    </div>
                                    {/* Player Count */}
                                    <div className="player-counter-container">
                                        <div className="player-counter-title">PLAYERS ACTIVE</div>
                                        {/* Replace Below with JS Function */}
                                        <div className="player-counter">
                                            23
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer>
                    {/* Copyright Claim */}
                </footer>
            </div>
		);
    }
}
  
export default Home;
  
