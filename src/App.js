import React, {useEffect} from 'react';
import './App.css';
import Form from "./Form"
// import Amplify, { API }  from "aws-amplify";
// import awsExports from "./aws-exports";

// Amplify.configure(awsExports);

function App() {

  // useEffect(() => {
  //   API.get('campapi', '/camp/id')
  //   .then((campRes) => console.log(campRes))
  //   .catch(error => {
  //     console.log(error.response);
  //   });
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
