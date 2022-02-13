import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import Example from "./components/example/Example";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={ <Home/> }/>
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
