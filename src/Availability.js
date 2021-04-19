import React, {useEffect, useState} from 'react';
import Amplify, {API} from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

export default function Availability(){
    const {data, setData} = useState([]);

    useEffect(() => {
        API.get('campapi', '/camp/id')
        .then(res => res.json())
        .then((campRes) => {
            console.log(campRes) 
            setData(campRes)
        })
        .catch(error => {
        console.log(error.response);
        });
    },[])

    

}