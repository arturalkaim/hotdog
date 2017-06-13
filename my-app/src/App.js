import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function  getHeader() {
   return <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to Hot Dog</h2>
          </div>
}

function getBody(){
        return <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
}

function getPage(){
     return <div className="App">
        {getHeader()}
        {getBody()}
      </div>
}

class App extends Component {
  render() {
    return getPage();
  }
}

export default App;
