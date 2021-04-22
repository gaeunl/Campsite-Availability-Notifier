import getData from './getData';
import Availability from "./Availability";
import deleteData from './deleteData';


export default async function handler(){
    // const map = new Map();
    const data = await getData();
    let email = "";
    let msg = "";
    let msgData = [];
    data.map(async(camp) =>{
        email = camp.email;
        let expired = checkExpiredDate(camp.date);
        if(expired){
            const response = deleteData(email, camp.id);
        }else{
            let url;
            if(camp.facility[0] == "All"){
                url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyplace/'+ camp.placeId+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
            }
            else{
                url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyfacility/'+ camp.facility[0]+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
            }
            msg = await Availability(url, camp);
            if(msg != ""){
                msgData.push(msg);
            }
        }
    })
    
    console.log(msgData);

    // for (let item of msgData) {
    //     let temp = item.split("//email//");
    //     if(map.has(temp[0])){
    //         map.set(temp[0], map.get(temp[0]) + temp[1]);
    //     }else{
    //         map.set(temp[0], temp[1]);
    //     }
    // }
    // console.log(map);

}

function checkExpiredDate(reservedDate){
  var d1 = new Date().toJSON().split('T')[0];
  var d2 = new Date(reservedDate).toJSON().split('T')[0];
  return (d1 > d2)? true: false;
}

