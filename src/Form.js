import React, { Component, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Form() {
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log(data);
    const [campgroundList, setCampgrounds] = useState([]);
    const [campName, setCampName] = useState("");
    const [unit, setUnit] = useState("");
    const [nights, setNights] = useState("");
    const [date, setDate] = useState("");
    const today = new Date();
    const [email, setEmail] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [facilityId, setFacilityId] = useState("");
    const [facility, setFacility] = useState("");
    const [facilityList, setFacilityList] = useState([]);
    let show = true;



    useEffect(() =>{
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
                    console.log(result);
                    if(result.length == 1){
                        setPlaceId(result[0].PlaceId);
                        // show = true;
                    }
                }
            )
            .catch(function() {
                console.log("No Matching History");
            });
    },[campName])


    const resetAll = (() =>{
        setCampName("");
        setUnit("");
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Park Name</label>
            <input type='text' list="park" value={campName} onChange={e => setCampName(e.target.value)} ref={register({ required: true })}/>
            <datalist id="park">
                {campgroundList.length? campgroundList.map((camp) =>
                    <option key={camp.Name} name={camp.PlaceId} value={camp.Name}>{camp.Name}</option>
                ) : (<option key="N/A" value="NO Matching Campsite" readonly > NO Matching Campsite</option>)} 
            </datalist>
                
            {show? 
                <>
                    <label>Facility(name of campsite)</label>
                    <input type='text' list="facility" value={facility} onChange={e => setFacility(e.target.value)} ref={register({ required: true })}/>
                    <datalist id="facility">
                        {/* <>
                            <option key=0 value="all">All</option>
                            {campgroundList.length? campgroundList.map((camp) =>
                                <option key={camp.Name} name={camp.PlaceId} value={camp.Name}>{camp.Name}</option>
                            ) 
                            </>
                        : (<option key="N/A" value="NO Matching Campsite" readonly > NO Matching Campsite</option>)}  */}
                    </datalist>
                </>
            : <></>}
            <datalist id="park">
                {campgroundList.length? campgroundList.map((camp) =>
                    <option key={camp.Name} name={camp.PlaceId} value={camp.Name}>{camp.Name}</option>
                ) : (<option key="N/A" value="NO Matching Campsite" readonly > NO Matching Campsite</option>)} 
            </datalist>

            <label>Select Date</label>
            <input type="date" id="date" name="date"
                min={today} value={date} onChange={e => setDate(e.target.value)}></input>

            <label >Stay Length (between 1 to 14):</label>
            <input type="number" value={nights} onChange={e => setNights(e.target.value)} min="1" max="14"/>
            <label for="email">Enter your email:</label>
            <input type="email"  value={email} onChange={e => setEmail(e.target.value)}></input>

            {errors.exampleRequired && <span>This field is required</span>}
            <input type="submit" />
        </form>
    );
}

