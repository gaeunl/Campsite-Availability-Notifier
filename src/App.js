import React, {useEffect, useState} from 'react';
import './App.css';
import Form from "./Form"
import Amplify, { API }  from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App() {

  const {data, setData} = useState([]);

  useEffect(() => {
    // API.get('campapi', '/camp/id')
    // .then((campRes) => {
    //   campRes.map((camp) =>{
    //     let free = 0;
    //     if(camp.facility[0] == "All"){
    //       let url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyplace/'+ camp.placeId+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
    //       fetch(url)
    //         .then(res => res.json())
    //         .then(
    //           (result) => {
    //               result.map((res) => {
    //                 if(res.IsFree && !res.IsLocked){
    //                   // console.log("UnitId:" + res.UnitId + "\nFacilityId:" + res.FacilityId);
    //                   free= free +1;
    //                 }
    //               })
    //               console.log(camp.date+"\nLength: "+ camp.night+"\nTotal Number of Avaiable Campsite : " + free +"\nCampsite Name: " + camp.campName);
    //           }
    //         )
    //         .catch(error => {
    //           console.log("Fetching Error:\n" + error);
    //         });
    //     }
    //     else{
    //       let url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyfacility/'+ camp.facility[0]+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
    //       fetch(url)
    //         .then(res => res.json())
    //         .then(
    //           (result) => {
    //               result.map((res) => {
    //                 if(res.IsFree && !res.IsLocked){
    //                   // console.log("UnitId:" + res.UnitId + "\nFacilityId:" + res.FacilityId);
    //                   free ++;
    //                 }
    //               })
    //               console.log(camp.date+"\nLength: "+ camp.night+"\nTotal Number of Avaiable Campsite : " + free +"\nCampsite Name: " + camp.campName);
    //           }
    //         )
    //         .catch(error => {
    //           console.log("Fetching Error:\n" + error);
    //         });
    //     }
    //   })
    //   setData(campRes)
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
