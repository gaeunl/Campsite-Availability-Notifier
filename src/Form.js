import React, { Component, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Amplify, { API }  from "aws-amplify";
import awsExports from "./aws-exports";


Amplify.configure(awsExports);


export default function Form() {
    const { register, handleSubmit, watch, errors } = useForm();
    const [campgroundList, setCampgrounds] = useState([]);
    const [campName, setCampName] = useState("");
    const [unit, setUnit] = useState("");
    const [nights, setNights] = useState("");
    const [date, setDate] = useState("");
    const today = new Date().toJSON().split('T')[0];
    const [email, setEmail] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [facilityId, setFacilityId] = useState("");
    const [facility, setFacility] = useState("");
    const [facilityList, setFacilityList] = useState([]);
    const emailRegExp = "[A-za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$";
    const generateUniqueId = require('generate-unique-id');


    const onSubmit = data => {
        let facilityData = facility.split(",");
        let valid = checkDate(date);
        if(!valid){
            alert("Date Format is wrong!\n\n Date should be greather than Today");
            return;
        }
        

        let confirmed = window.confirm(`Request detail: \n 
            Email: ${email} \n 
            Campsite Name: ${campName} \n
            Facility: ${facilityData[1]} \n
            Date: ${date} \n
            Nights: ${nights} `);
        if(!confirmed){ //user pressed cancel
            return;
        }
        API
            .post('campapi', '/camp', {
                //sent as a body or the payload over to our backend
                body:{
                    id: generateUniqueId(),
                    facility: facilityData,
                    campName:campName,
                    date: date,
                    email: email,
                    night:nights,
                    placeId:placeId.toString(),
                    unitId:"n/a",  //todo
                    available:false //todo
                }
            })
            .then(response => {
                console.log("success\n" +response);
            })
            .catch(error => {
                console.log("Error\n" + error.response);
            });
        alert("Your information has been submitted successfully.\n Please check your email for the confirmation message.")
    };

    useEffect(() =>{
        if(campName.length < 2){
            return;
        }
        let addr = "https://bccrdr.usedirect.com/rdr/rdr/fd/citypark/namecontains/" + campName + "?_=1616539859706";
        fetch(addr)
            .then(res => res.json())
            .then(
                (result) => {
                    var filtered = result.filter(function(value){ 
                        return value.PlaceId != 0;
                    });
                    setCampgrounds(filtered);
                    setFacilityList([]);
                    setFacility([]);
                    if(result.length == 1){
                        setPlaceId(result[0].PlaceId);
                        let data = {
                            CountNearby: false,
                            PlaceId: result[0].PlaceId,
                            StartDate: today
                        }
                        fetch("https://bccrdr.usedirect.com/rdr/rdr/search/place", {
                            method: 'POST', // or 'PUT'
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Success:', Object.values(data.SelectedPlace.Facilities));
                                setFacilityList(Object.values(data.SelectedPlace.Facilities));
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    }
                }
            )
            .catch(function() {
                console.log("No Matching History");
            });
    },[campName])


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Park Name</label>
            <input type='text' list="park" value={campName} onChange={e => setCampName(e.target.value) } required/>
            <datalist id="park">
                {campgroundList.length? campgroundList.map((camp) =>
                    <option key={camp.PlaceId} value={camp.Name}>{camp.Name}</option>
                ) : (<option key="" readonly > NO Matching Campsite</option>)} 
            </datalist>
                
            <label>Facility(name of campsite)</label>
            <select id="facility" value={facility} onChange={e => setFacility(e.target.value)} required>
                <option key = "" value="">--Select One--</option>
                {
                    facilityList.length? 
                        <>
                            <option key = "0" value="All,All">All</option>
                            {facilityList.map((facility) =>
                                <option key={facility.FacilityId} value={[facility.FacilityId, facility.Name]}>{facility.Name}</option>)} 
                        </>
                        : 
                        <></>
                } 
            </select>
            
           
            <label>Select Date (yyyy-mm-dd)</label>
            <input type="date" id="date" name="date"
                min={today} value={date} onChange={e => setDate(e.target.value)} placeholder="yyyy-mm-dd" required pattern="\d{4}-\d{2}-\d{2}"></input>

            <label >Stay Length (between 1 to 14)</label>
            <input type="number" value={nights} onChange={e => setNights(e.target.value)} required min="1" max="14"/>
            
            
            <label for="email">Email Address</label>
            <input type="email"  value={email} onChange={e => setEmail(e.target.value)} required pattern = {emailRegExp}></input>

            {errors.exampleRequired && <span>This field is required</span>}
            <input type="submit" />
        </form>
    );
}

function checkDate(reservedDate){
    var today = new Date().toJSON().split('T')[0];
    var input = new Date(reservedDate).toJSON().split('T')[0];
    return (today <= input)? true: false;
}