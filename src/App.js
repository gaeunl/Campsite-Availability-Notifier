import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Form from "./Form"
// import Amplify, { API }  from "aws-amplify";
// import awsExports from "./aws-exports";

// Amplify.configure(awsExports);

function App() {

  // useEffect(() => {
  //   API.get('campapi', '/camp')
  //   .then(campRes => console.log(campRes))
  // },[])
  
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
