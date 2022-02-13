
import { app, auth } from "./init-firebase.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

// Constant Variables
const error_email_in_use = "auth/email-already-in-use";
const error_weak_password = "auth/weak-password";

const register_form = document.querySelector(".account-form-panel");

// Registration Submission Button Event
register_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user_email = register_form["register-email"].value;
    const user_password = register_form["register-password"].value;

    createUserWithEmailAndPassword(auth, user_email, user_password).then(user_credentials => {
        // If Successfully Registered User
        console.log(user_credentials);  
        register_form.reset();
        
        // Change to Home Page
        
    }).catch(error => {
        // If Failed To Register User
        // Error Codes Found Here: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
        const error_code = error.code;
        const errorMessage = error.message;
        console.log(error_code);
        
        // If Email Is Already Registered
        if (error_code == error_email_in_use) {
            let existing_email_msg = document.getElementById("existing-email");
            existing_email_msg.style.opacity = 100;
            setTimeout(function() {
                existing_email_msg.style.opacity = 0;
            }, 5000);
        }
        
        // If Password Is Weak
        if (error_code == error_weak_password) {
            let weak_password_msg = document.getElementById("weak-password");
            weak_password_msg.style.opacity = 100;
            setTimeout(function() {
                weak_password_msg.style.opacity = 0;
            }, 5000);
        }

        // If Email Is Invalid

        // If Operation Is Not Allowed
    })
})