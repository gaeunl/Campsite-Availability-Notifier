import React, {useEffect, useState} from 'react';

export default async function Availability( url, camp ){
    let free = 0;
    const data = await fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                result.map((res) => {
                    if(res.IsFree && !res.IsLocked){
                        // console.log("UnitId:" + res.UnitId + "\nFacilityId:" + res.FacilityId);
                        free ++;
                    }
                })
                if(free == 0){
                    return "";
                }
                let temp = camp.email + "//email//"+ camp.campName + " is available on \n" + camp.date + "\nLength: "+camp.night+" night(s) \nTotal Number of Avaiable Campsite : "+free +' \n Facility: '+camp.facility[1]+'\n\n\n'
                return temp;
            }
        )
        .catch(error => {
            console.log("Fetching Error:\n" + error);
        });
    return data;
}