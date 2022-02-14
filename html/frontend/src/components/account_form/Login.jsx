// Import React
import React from 'react';
import { Link, Navigate } from "react-router-dom"

// Import CSS Stylesheet
import "../../styles/main.css";

// Import Firebase
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../scripts/init-firebase.js";

// Constant Variables
const error_email_in_use = "auth/email-already-in-use";
const error_weak_password = "auth/weak-password";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signed_in: false
        };

        this.sign_in_user = this.sign_in_user.bind(this);
    }

    // Login Submission Button Event
    sign_in_user(e) {
        e.preventDefault();
        const login_form = document.querySelector(".account-form-panel");
        const user_email = login_form["login-email"].value;
        const user_password = login_form["login-password"].value;

        signInWithEmailAndPassword(auth, user_email, user_password).then(user_credentials => {
            // If Successfully Signed In the User
            console.log(user_credentials);
            login_form.reset();

            // Change to Home Page
            this.setState({ signed_in: true });
        }).catch(error => {
            // If Failed To Sign In The User
        })
    }

	render() {
        // console.log(this.state.signed_in)
        if (this.state.signed_in) {
            console.log("User Signed In")
            return <Navigate to="/"/>;
        }

        return (
            <div>
                {/* Header */}
                <header className="account-form-header">
                    <div className="neonText">LOGIN</div>
                </header>

                {/* Registration Panel */}
                <div className="account-form-container">
                    <form className="account-form-panel" id="login-panel">
                        {/* Email Field */}
                        <div className="account-form-warning" id="existing-email">
                            <p>User Already Exists With Email.</p>
                        </div>
                        <div className="input-field-container">
                            <input type="email" className="input-field" id="login-email" placeholder="EMAIL"></input>
                        </div>
                        {/* Password Field */}
                        <div className="account-form-warning" id="weak-password">
                            <p>Your Password Is Weak-Ass</p>
                        </div>
                        <div className="input-field-container">
                            <input type="password" className="input-field" id="login-password" placeholder="PASSWORD"></input>
                        </div>
                        {/* Spacers */}
                        <div className="account-form-spacer"></div>
                        {/* Submission Button */}
                        <div className="account-form-button-container">
                            <button className="account-form-button" onClick={this.sign_in_user}>Log-In</button>
                        </div>
                        {/* Switch To Login Button */}
                        <div className="account-form-button-container">
                            <Link className="react-link" to="/register">
                                <button className="account-form-button">Register Instead</button>
                            </Link>
                        </div>
                        {/* Go Back To Home */}
                        <div className="account-form-button-container">
                            <Link className="react-link" to="/">
                                <button className="account-form-button">Go Back Home</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
		);
    }
}
  
export default Login;
  
