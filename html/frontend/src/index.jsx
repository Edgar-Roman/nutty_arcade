// Import React
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
import LoadingScreen from './components/loading_screen/LoadingScreen';
import Home from "./components/home/Home";
import Register from "./components/account_form/Register";
import Login from "./components/account_form/Login";
// import Example from "./components/example/Example";

// Import Scripts
import { auth } from "./scripts/init-firebase.js";
import reportWebVitals from './reportWebVitals';

// Loading Screen
ReactDOM.render(
    <LoadingScreen />,
    document.getElementById("root"),
);

// Wait For Authentication API To Finish Initialization
auth.onAuthStateChanged(user => {
    console.log("Finished")
    ReactDOM.render(
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={ <Home /> }/>
                    <Route path="/register" element={ <Register /> }/>
                    <Route path="/login" element={ <Login /> }/>
                </Routes>
            </Router>
        </React.StrictMode>,
        document.getElementById('root'),
    );
})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
