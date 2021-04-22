import React, {useEffect, useState} from 'react';
import './App.css';
import Form from "./Form"
import Handler from "./data/Handler";

function App() {
  useEffect(() => {
    // Handler();
  })
  
  
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Fun Camping!</h2>
        <div className = "Forms">
          <Form/>
        </div>
      </header>
    </div>
  );
}

export default App;
