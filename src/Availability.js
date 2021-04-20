import React, {useEffect, useState} from 'react';
import Amplify, {API} from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

export default function Availability( url, camp ){
    let free = 0;
    fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                result.map((res) => {
                if(res.IsFree && !res.IsLocked){
                    // console.log("UnitId:" + res.UnitId + "\nFacilityId:" + res.FacilityId);
                    free ++;
                }
                })
                let msg = '${camp.campName} is available on \n${camp.date} \nLength: #{camp.night} night(s) \nTotal Number of Avaiable Campsite : ${free} '
                // if(free > 0){
                //     Email.send({
                //         Host: "smtp.gmail.com",
                //         Username: "",
                //         Password: "",
                //         To: camp.email,
                //         From: "CampHelperDoNotReply@gmail.com",
                //         Subject: camp.campName +" Campsite is Available",
                //         Body: msg,
                //     })
                // }
                console.log(camp.date+"\nLength: "+ camp.night+" night(s) \nTotal Number of Avaiable Campsite : " + free +"\nCampsite Name: " + camp.campName);
            }
        )
        .catch(error => {
            console.log("Fetching Error:\n" + error);
        });
}