// Import React
import React from 'react';

// Import CSS Stylesheet
// import "../../styles/main.css";

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
                        <div id="row1" class="header-background"></div>
                        <div id="row2" class="header-background"></div>
                        <div id="row3" class="header-background"></div>
                        <div id="row4" class="header-background"></div>
                        <div id="row5" class="header-background"></div>
                        <div id="row6" class="header-background"></div>
                        <p id="logo">
                            NUTTY ARCADE
                        </p>
                        <div id="log-in-button-container" class="account-button-container">
                            <button id="log-in-button" class="account-button">
                                LOG IN
                            </button>
                        </div>
                        <div id="register-button-container" class="account-button-container">
                            <button id="register-button" class="account-button">
                                REGISTER
                            </button>
                        </div>
                        
                    </div>
                </header>

                <main>
                    {/* Category */}
                    {/* Card Games */}
                    <div class="category-container">
                        <div id="card-games" class="page-category">
                            CARD GAMES
                        </div>
                    </div>
                    
                    {/* Game Browser */}
                    <div id="card-games" class="game-browser">
                        {/* Example Game Module */}
                        {/* Game Wrapper */}
                        <div id="game-fish" class="game">
                            {/* Game Menu */}
                            <div id="fish-menu" class="game-menu">
                                {/* Thumbnail */}
                                <div id="fish-thumbnail" class="thumbnail"></div>
                            </div>
                            {/* Game Information */}
                            <div class="game-information">
                                {/* Title */}
                                <div class="game-title">FISH</div>
                                {/* Play Button */}
                                <div class="button-container">
                                    <button class="play-button">PLAY NOW</button>
                                </div>
                                {/* Player Count */}
                                <div class="player-counter-container">
                                    <div class="player-counter-title">PLAYERS ACTIVE</div>
                                    {/* Replace Below with JS Function */}
                                    <div class="player-counter">
                                        5
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                </main>
            </div>
			
            

        // <main>
            
            
        //     <!-- Board Games -->
        //     <div class="category-container">
        //         <div id="board-games" class="page-category">
        //             BOARD GAMES
        //         </div>
        //     </div>
        //     <!-- Games Browser -->
        //     <div id="board-games" class="game-browser">
        //         <!-- Example Game Module -->
        //         <!-- Game Wrapper -->
        //         <div id="game-pioneers" class="game">
        //             <!-- Game Menu -->
        //             <div id="pioneers-menu" class="game-menu">
        //                 <!-- Thumbnail -->
        //                 <div id="pioneers-thumbnail" class="thumbnail">

        //                 </div>
        //             </div>
        //             <!-- Game Information -->
        //             <div class="game-information">
        //                 <!-- Title -->
        //                 <div class="game-title">
        //                     PIONEERS
        //                 </div>
        //                 <!-- Play Button -->
        //                 <div class="button-container">
        //                     <button class="play-button">
        //                         PLAY NOW
        //                     </button>
        //                 </div>
        //                 <!-- Player Count -->
        //                 <div class="player-counter-container">
        //                     <div class="player-counter-title">
        //                         PLAYERS ACTIVE
        //                     </div>
        //                     <!-- Replace Below with JS Function -->
        //                     <div class="player-counter">
        //                         15
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <br>
        //     <br>

        //     <!-- Nutty Casino -->
        //     <div class="category-container">
        //         <div id="nutty-casino" class="page-category">
        //             NUTTY CASINO
        //         </div>
        //     </div>
        //     <!-- Games Browser -->
        //     <div id="board-games" class="game-browser">
        //         <!-- Example Game Module -->
        //         <!-- Game Wrapper -->
        //         <div id="game-blackjack" class="game">
        //             <!-- Game Menu -->
        //             <div id="blackjack-menu" class="game-menu">
        //                 <!-- Thumbnail -->
        //                 <div id="fish-thumbnail" class="thumbnail">

        //                 </div>
        //             </div>
        //             <!-- Game Information -->
        //             <div class="game-information">
        //                 <!-- Title -->
        //                 <div class="game-title">
        //                     BLACKJACK
        //                 </div>
        //                 <!-- Play Button -->
        //                 <div class="button-container">
        //                     <button class="play-button">
        //                         PLAY NOW
        //                     </button>
        //                 </div>
        //                 <!-- Player Count -->
        //                 <div class="player-counter-container">
        //                     <div class="player-counter-title">
        //                         PLAYERS ACTIVE
        //                     </div>
        //                     <!-- Replace Below with JS Function -->
        //                     <div class="player-counter">
        //                         23
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </main>
        // <!-- <footer>
        //     Copyright claim???
        // </footer> --></br>
		);
    }
}
  
  export default Home;
  
