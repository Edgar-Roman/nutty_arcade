// Import React Component
import React from "react";

// Import CSS StyleSheet
import "./LoadingScreen.css";

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dotLength: 0,
      maxDotLength: 3
    }
  }

  componentDidMount() {
    // Default Mount Message
    console.log("Loading Screen Mounted");
  }

  componentDidUpdate() {
    // Default Update Message
    console.log("Loading Screen Updated");
  }

  render() {
    return(
      <div id="loading_screen-message-container">
        <p id="loading_screen-message">LOADING...</p>
        <div id="loading_screen-image"></div>
      </div>
    );
  }
}

export default LoadingScreen;