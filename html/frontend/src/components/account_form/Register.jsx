// Import React
import React from 'react';
import { Link, Navigate } from "react-router-dom";

// Import CSS Stylesheet
import "../../styles/main.css";

// Import Firebase
import { auth, createUserWithEmailAndPassword } from "../../scripts/init-firebase.js";

// Constant Variables
const error_email_in_use = "auth/email-already-in-use";
const error_weak_password = "auth/weak-password";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signed_in: false
        };
        this.register_user = this.register_user.bind(this);
    }

    // Registration Submission Button Event
    register_user(e) {
        e.preventDefault();
        const register_form = document.querySelector(".account-form-panel");
        const user_email = register_form["register-email"].value;
        const user_password = register_form["register-password"].value;
        
        createUserWithEmailAndPassword(auth, user_email, user_password).then(user_credentials => {
            // If Successfully Registered User
            console.log(user_credentials);
            register_form.reset();
            
            // Change to Home Page
            this.setState({ signed_in: true });
            
        }).catch(error => {
            // If Failed To Register User, Display Error Message
            // Error Codes Found Here: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
            const error_code = error.code;
            // const error_message = error.message;
            console.log(error_code);

            // If Email Is Already Registered
            if (error_code === error_email_in_use) {
                let existing_email_msg = document.getElementById("existing-email");
                existing_email_msg.style.opacity = 100;
                setTimeout(function() {
                    existing_email_msg.style.opacity = 0;
                }, 5000);
            }

            // If Password Is Weak
            if (error_code === error_weak_password) {
                let weak_password_msg = document.getElementById("weak-password");
                weak_password_msg.style.opacity = 100;
                setTimeout(function() {
                    weak_password_msg.style.opacity = 0;
                }, 5000);
            }

            // If Email Is Invalid

            // If Operation Is Not Allowed
        });
    }

	render() {
        if (this.state.signed_in) {
            console.log("User Signed In")
            return <Navigate to="/"/>;
        }

        return (
            <div>
                {/* Header */}
                <header className="account-form-header">
                    <div className="neonText">REGISTER</div>
                </header>

                {/* Registration Panel */}
                <div className="account-form-container">
                    <form className="account-form-panel" id="register-panel">
                        {/* Email Field */}
                        <div className="account-form-warning" id="existing-email">
                            <p>User Already Exists With Email.</p>
                        </div>
                        <div className="input-field-container">
                            <input type="email" className="input-field" id="register-email" placeholder="EMAIL"></input>
                        </div>
                        {/* Password Field */}
                        <div className="account-form-warning" id="weak-password">
                            <p>Your Password Is Weak-Ass</p>
                        </div>
                        <div className="input-field-container">
                            <input type="password" className="input-field" id="register-password" placeholder="PASSWORD"></input>
                        </div>
                        {/* Spacers */}
                        <div className="account-form-spacer"></div>
                        {/* Submission Button */}
                        <div className="account-form-button-container">
                            <button className="account-form-button" onClick={this.register_user}>Create Account</button>
                        </div>
                        {/* Switch To Login Button */}
                        <div className="account-form-button-container">
                            <Link className="react-link" to="/login">
                                <button className="account-form-button">Log-In Instead</button>
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
  
export default Register;
  
