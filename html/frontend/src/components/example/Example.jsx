// Import React
import React from 'react';

// Import CSS Stylesheet
import "./Example.css";


class Example extends React.Component {
	// Example Constructor
    constructor(props) {
        super(props);
        this.state = {
            example_state: 0
        };
    }

    // Example Method
    handleClick() {
		console.log('this is:', this);
    }

    // Example Render
	render() {
        return (
			// Insert HTML + JS Content Here
            <div>Hello</div>
		);
    }
}
  
  export default Example;
  
