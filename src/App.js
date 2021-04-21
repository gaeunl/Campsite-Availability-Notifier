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
    //     let expired = checkDate(camp.date);
    //     if(expired){
    //       /* Delete */
    //       API
    //         .del('campapi', '/camp/object/' + camp.email + '/' + camp.id)
    //         .then(response => {
    //           // Add your code here
    //           console.log("Successfully Deleted:\n" + response);
    //         })
    //         .catch(error => {
    //           console.log(error.response);
    //         });
    //     }else{
    //       let url;
    //       if(camp.facility[0] == "All"){
    //         url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyplace/'+ camp.placeId+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
    //       }
    //       else{
    //         url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyfacility/'+ camp.facility[0]+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
    //       }
    //       Availability(url, camp);
    //     }
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

function checkDate(reservedDate){
  var d1 = new Date().toJSON().split('T')[0];
  var d2 = new Date(reservedDate).toJSON().split('T')[0];
  return (d1 > d2)? true: false;
}

export default App;
