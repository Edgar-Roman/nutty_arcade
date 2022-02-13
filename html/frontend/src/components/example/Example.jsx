// This is an example component intended to be used as reference

// Imports
import React from 'react';

// React Components are subclass of React.Componment.
class Example extends React.Component {
  constructor(props) {
    super(props); // Must run the constructor of React.Component first

    // Components have a special property named "state" that holds state.
    // We can initialize it here.
    // We read the example model data into the state variable 'name'
    this.state = {
      name: window.cs142models.exampleModel().name,
      motto: window.cs142models.exampleModel().motto,
      counter: 0,
      inputValue: '',
      buttonWasClicked: '',
    };

    // React events are called directly from DOM event handlers
    // so we cannot directly call the methods of this class. We
    // generate new functions that handle the event by just calling
    // the method that handles the event.
    this.handleChangeBound = event => this.handleChange(event);
    // Note: A commmon idiom in React code is to use JavaScript bind() to
    // smash the method to accomplish this passthrough to the method:
    //      this.handleChange = this.handleChange.bind(this);
  }

  // React components have several "lifecycle functions"
  // https://reactjs.org/docs/react-component.html
  // that are used to inform the Component of interesting events.

  // componentDidMount - Called when Component is activiated
  componentDidMount() {
    // To demonstate state updating we define a function
    // that increments the counter state and instruct the
    // DOM to call it every 2 seconds.
    /* eslint-disable react/no-access-state-in-setstate */
    const counterIncrFunc = () => this.setState({
      counter: this.state.counter + 1,
    });
    this.timerID = setInterval(counterIncrFunc, 2 * 1000);
  }

  // componentWillUnmount - Called when Component is deactivated.
  componentWillUnmount() {
    // We need to tell the DOM to stop calling us otherwise React
    // will complain when we call setState on an unmounted component.
    clearInterval(this.timerID);
  }

  // Method called when the input box is typed into.
  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleMottoChange(event) {
    this.setState({ motto: event.target.value });
  }

  // Method called when the button is pushed
  /* eslint-disable-next-line no-unused-vars */
  handleButtonClick(buttonName, event) {
    this.setState({ buttonWasClicked: buttonName });
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default Example;
