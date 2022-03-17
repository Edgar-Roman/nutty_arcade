import React from 'react';
import './Fish.css'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
       <div className="header">
            <h1>FISH</h1>
        </div>
    );
  }
}

export default Header