import React, { Component } from 'react';
import Dashboard from './components/Dashboard'
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact compoent={ Dashboard }/>
      </Router>
    );
  }
}

export default App;
