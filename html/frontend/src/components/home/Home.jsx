// Import React
import React from 'react';
import { Link } from "react-router-dom";

// Import CSS Stylesheet
import "../../styles/main.css";

// Import Firebase
import { auth } from "../../scripts/init-firebase.js";
import { firestore, query, collection, where, getDocs } from "../../scripts/init-firebase.js";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            user_data: "",
            playerbase_data: {},
            logged_in: false
        };

        // Bind Functions
        this.sign_user_out = this.sign_user_out.bind(this);
    }

    updateComponent() {
        let user = auth.currentUser;
        this.setState({ user: user });
        if (user) {
            // Update User Information
            const user_query = query(collection(firestore, "users"), where("email", "==", user.email));
            getDocs(user_query).then((user_snapshot) => {
                user_snapshot.forEach((snapshot) => {
                    this.setState({ user_data: snapshot.data() });
                });
            }).catch((err) => {
                console.log(err);
            });
            this.setState({ logged_in: true });
        }

        // Update Player Base Information
        let playerbase_data = {};
        const playerbase_query = query(collection(firestore, "playerbase"));
        getDocs(playerbase_query).then((playerbase_snapshot) => {
            playerbase_snapshot.forEach((snapshot) => {
                console.log(snapshot.data())
                let game_id = snapshot.data().game_id;
                let num_players = snapshot.data().num_players.toString();
                playerbase_data[game_id] = { num_players: num_players };
            });
            this.setState({ playerbase_data: playerbase_data });
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.updateComponent();
    }

    componentDidUpdate() {
        let currentUser = auth.currentUser;
        console.log(currentUser)
        if (currentUser !== this.state.user) {
            this.updateComponent();
        }
    }

    show_login_button = () => {
        return (
            <div id="log-in-button-container" className="account-button-container">
                <Link className="react-link" to="/login">
                    <button id="log-in-button" className="account-button">LOG IN</button>
                </Link> 
            </div>
        );
    }

    show_register_button = () => {
        return(
            <div id="register-button-container" className="account-button-container">
                <Link className="react-link" to="/register">
                    <button id="register-button" className="account-button">REGISTER</button>
                </Link>
            </div>
        );
    }

    show_logoff_button = () => {
        return (
            <div id="register-button-container" className="account-button-container">
                <button id="log-out-button" className="account-button" onClick={this.sign_user_out}>LOG OFF</button>
            </div>
        )
    }

    sign_user_out(e) {
        e.preventDefault();
        auth.signOut().then(() => {
            console.log("User Signed Out");
        });
        this.setState({ logged_in: false });
        this.setState({ user: auth.currentUser });
    }

    show_welcome_message = () => {
        let user_first_name = "";
        if (this.state.user_data) {
            user_first_name = this.state.user_data.first_name
        }
        return (
            <div id="welcome-message-container">
                Welcome {user_first_name}!
            </div>
        );
    };

    show_number_active_players(game_id) {
        if (this.state.playerbase_data.hasOwnProperty(game_id)) {
            return this.state.playerbase_data[game_id].num_players
        } else {
            return "Loading...";
        }
    }

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
                        <p id="logo">NUTTY ARCADE</p>
                        { this.state.logged_in ? this.show_logoff_button(): this.show_login_button() }
                        { this.state.logged_in ? null: this.show_register_button() }
                        { this.state.logged_in ? this.show_welcome_message() : null }
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
                                <Link className="react-link" to="/fish">
                                    <button className="play-button">PLAY NOW</button>
                                </Link>
                                </div>
                                {/* Player Count */}
                                <div className="player-counter-container">
                                    <div className="player-counter-title">PLAYERS ACTIVE</div>
                                    {/* Replace Below with JS Function */}
                                    <div className="player-counter">
                                        {this.show_number_active_players("fish")}
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
  
