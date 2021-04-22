import Amplify, { API }  from "aws-amplify";
import awsExports from "../aws-exports";

export default function getData() { 
    const apiName = 'campapi';
    const path = '/camp/email';
    return API.get(apiName, path);

    // API.get('campapi', '/camp/email')
    // .then((campRes) => {
    //   console.log(campRes);
    // })
    // .catch(error => {
    //   console.log(error.response);
    // });
}