// Create an email template
// .. name of campsite
// .. name of selected facility
// .. number of free campsites
// .. requested date
// .. number of nights

// Get Camp Data from Dynamodb called Camp
// Check the date and delete data if expired
// .. to delete we need to use dynamodb  delete method
// if not expired
// .. use fetch API method to send network request to get camp availability from bcpark open source
// .. iterate fetched data to see how many campsites are free
// .. send email if number of free campsites is more than 0

const fetch = require("node-fetch");
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const gmail = require('./password');
AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "email";
const partitionKeyType = "S";
const sortKeyName = "id";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/camp";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

let tableName = "campdb";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

// install aws-sdk, cron, nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmail.email,
    pass: gmail.password
  }
});


const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

var condition = {};
//Get Camp data Request
condition[partitionKeyName] = {
  ComparisonOperator: 'EQ'
}

try {
  condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType('email', partitionKeyType) ];
} catch(err) {
  console.log({error: 'Wrong column type ' + err});
}

let queryParams = {
  TableName: tableName,
  KeyConditions: condition
}

let queryData = [];
try{ 
  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      console.log({error: 'Could not load items: ' + err});
    } else {
      //data.Items
      console.log({data: data});
      console.log({data: data.Items});
      queryData = data.Items;
      queryData.map(async(camp)=>{
        let expired = checkExpiredDate(camp.date);
        if(expired){
          // const response = deleteCampData(camp.email, camp.id);
        }else{
          let url;
          if(camp.facility[0] == "All"){
              url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyplace/'+ camp.placeId+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
          }
          else{
              url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyfacility/'+ camp.facility[0]+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
          }
          // Availability function will return message iff there is a free campsite
          const msg = await Availability(url, camp);
          if(msg != ""){
            var mailOptions = {
              from: 'camphelper_do_not_reply@gmail.com',
              to: camp.email,
              subject: `${camp.campName} is avaiable on ${camp.date}!!`,
              html: `<p>${msg}<p>`
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
        }
      })
    }
  })
}catch(err){
  console.log("Fail to Scan ",err);
}


function checkExpiredDate(reservedDate){
  var d1 = new Date().toJSON().split('T')[0];
  var d2 = new Date(reservedDate).toJSON().split('T')[0];
  return (d1 > d2)? true: false;
}


async function Availability( url, camp ){
  const fetch = require("node-fetch");
  let free = 0;
  const data = await fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        result.map((res) => {
          if(res.IsFree && !res.IsLocked){
            free ++;
          }
        })
        if(free == 0){
          return "";
        }
        let temp =  camp.campName + " is available on <br>" + camp.date + "<br><br>Length: "+camp.night+" night(s) <br><br>Total Number of Avaiable Campsite : "+free +' <br><br>Facility: '+camp.facility[1];
        return temp;
      }
    )
    .catch(error => {
        console.log("Fetching Error:\n" + error);
    });
  return data;
}

// delete camp data
async function deleteCampData(email, id) { 
    // return await API.del('campapi', '/camp/object/' + email + '/' + id);
    var params = {};
    params[partitionKeyName] = req.params[partitionKeyName];
    params[partitionKeyName] = convertUrlType(email, partitionKeyType);
    params[sortKeyName] = convertUrlType(id, sortKeyType);
    let removeItemParams = {
      TableName: tableName,
      Key: params
    }
    dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      console.log('delete Error\n', {error: err, url: req.url});
    } 
  });
}
