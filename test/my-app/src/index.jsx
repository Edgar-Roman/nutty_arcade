// Import React Components
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import App Components
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";
import Home from './components/Home/Home.jsx';

// Import Scripts
import { auth } from "./scripts/init-firebase.js";


// Import CSS Modules

// Import Web Vitals
import reportWebVitals from './reportWebVitals';

// Open Loading Screen
ReactDOM.render(
  <LoadingScreen/>,
  document.getElementById("root")
);

auth.onAuthStateChanged((user) => {
  console.log("Checked Authentication");
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Home user={user}/>}/>
        </Routes>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
