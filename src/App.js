import React, {useEffect, useState} from 'react';
import './App.css';
import Form from "./Form"
import Amplify, { API }  from "aws-amplify";
import awsExports from "./aws-exports";
import Availability from "./Availability";

Amplify.configure(awsExports);

function App() {

  const {data, setData} = useState([]);

  useEffect(() => {
    // API.get('campapi', '/camp/id')
    // .then((campRes) => {
    //   campRes.map((camp) =>{
    //     let url;
    //     if(camp.facility[0] == "All"){
    //       url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyplace/'+ camp.placeId+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
    //     }
    //     else{
    //       url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyfacility/'+ camp.facility[0]+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
    //     }
    //     Availability(url, camp);
    //   })
    // })
    // .catch(error => {
    //   console.log(error.response);
    // });
    
  },[])
  
  
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
