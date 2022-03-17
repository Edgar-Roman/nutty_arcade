// Import React
import React from "react";
import Link from "react-router-dom";

// Import CSS Stylesheet
import "./Home.css";

// Import Firebase
import { auth } from "../../scripts/init-firebase.js";
import { firestore, 
         query, 
         collection, 
         where, 
         getDocs } from "../../scripts/init-firebase.js";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.updateComponent();
  }

  componentDidUpdate() {
    if (auth.currentUser !== this.props.user) {
      this.updateComponent();
    }
  }

  updateComponent() {
    this.props.user = auth.currentUser;
    
  }

  displayHeader() {
    let headerRows = [];
    for(let i = 1; i <= 6; i++) {
      headerRows.push(
        <div key={i} id={"row" + (i).toString()} className="header-background"></div>
      );
    }
    return (
      <header>
          <div id="logo_header">
              {headerRows}
              <p id="logo">NUTTY ARCADE</p>
              {/* { this.state.logged_in ? this.show_logoff_button(): this.show_login_button() }
              { this.state.logged_in ? null: this.show_register_button() }
              { this.state.logged_in ? this.show_welcome_message() : null } */}
          </div>
      </header>
    );
  };

  render() {
    return(
      <div>
        {/* Page Logo Header */}
        {this.displayHeader()}
      </div>
    );
  }
}

export default Home;