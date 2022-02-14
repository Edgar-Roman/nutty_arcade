// Import React
import React from 'react';

// Import CSS Stylesheet
import "../../styles/main.css";

class LoadingScreen extends React.Component {
	render() {
        return (
            <div id="loading-message-container">
                <p id="loading-message">LOADING...</p>
                <div id="loading-image"></div>
            </div>
        )
    }
}
  
export default LoadingScreen;
  
