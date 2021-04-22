import Amplify, { API }  from "aws-amplify";
import awsExports from "../aws-exports";
import Availability from "./Availability";

export default async function deleteData(email, id) { 
    return await API.del('campapi', '/camp/object/' + email + '/' + id);
        // API
        // .del('campapi', '/camp/object/' + camp.email + '/' + camp.id)
        // .then(response => {
        //     console.log("CampId: ${camp.id} is Successfully Deleted:\n" + response);
        // })
        // .catch(error => {
        //     console.log(error.response);
        // });
}
