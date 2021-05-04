/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');
// const cron = require('node-cron');

AWS.config.update({ region: process.env.TABLE_REGION });



/*'0 12/1 * * *' for every 12 hr */
// cron.schedule('0 12/1 * * *', function() {
//   //every 1 hr
  // let queryParams = {
  //   TableName: tableName,
  //   KeyConditions: condition
  // }

  // // change to scan
  // dynamodb.scan(queryParams, (err, data) => {
  //   if(!err) {
  //     data.Items.map(async(camp) =>{
  //       var d1 = new Date().toJSON().split('T')[0];
  //       var d2 = new Date(camp.date).toJSON().split('T')[0];
  //       email = camp.email;
  //       let expired = d1>d2;

  //       if(expired){
  //         app.delete();
  //       }else{
  //           let url;
  //           if(camp.facility[0] == "All"){
  //               url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyplace/'+ camp.placeId+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
  //           }
  //           else{
  //               url = 'https://bccrdr.usedirect.com/rdr/rdr/fd/availability/getbyfacility/'+ camp.facility[0]+'/startdate/'+camp.date+'/nights/'+camp.night+'/true?_=1616538168676'
  //           }
  //           msg = await Availability(url, camp);
  //           if(msg != ""){
  //               msgData.push(msg);
  //           }
  //       }
  //     })
  //   }
  // });
// });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "campdb";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

// if user is logged in with an account then change to true. since no authentication needed it should be false
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
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

// /********************************
//  * HTTP Get method for list objects * Based on email Addr
//  ********************************/

// app.get(path + '/getByemail'+hashKeyPath, function(req, res) {
//   var condition = {}
//   condition[partitionKeyName] = {
//     ComparisonOperator: 'EQ'
//   }

//   if (userIdPresent && req.apiGateway) {
//     condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
//   } else {
//     try {
//       condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }

//   let queryParams = {
//     TableName: tableName,
//     KeyConditions: condition
//   }

//   // change to scan
//   dynamodb.query(queryParams, (err, data) => {
//     if (err) {
//       res.statusCode = 500;
//       res.json({error: 'Could not load items: ' + err});
//     } else {
//       res.json(data.Items);
//     }
//   });
// });


// /********************************
//  * HTTP Get method for list objects *
//  ********************************/

// app.get(path + hashKeyPath, function(req, res) {
//   var condition = {}
//   condition[partitionKeyName] = {
//     ComparisonOperator: 'EQ'
//   }

//   if (userIdPresent && req.apiGateway) {
//     condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
//   } else {
//     try {
//       condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
//       console.log({reqparams: req.params[partitionKeyName]});

//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }

//   let queryParams = {
//     TableName: tableName,
//     KeyConditions: condition
//   }

//   // change to scan
//   dynamodb.scan(queryParams, (err, data) => {
//     if (err) {
//       res.statusCode = 500;
//       res.json({error: 'Could not load items: ' + err});
//     } else {
//       res.json(data.Items);
//     }
//   });
// });
// /*****************************************
//  * HTTP Get method for get single object *
//  *****************************************/

// app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
//   var params = {};
//   if (userIdPresent && req.apiGateway) {
//     params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   } else {
//     params[partitionKeyName] = req.params[partitionKeyName];
//     try {
//       params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }
//   if (hasSortKey) {
//     try {
//       params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }

//   let getItemParams = {
//     TableName: tableName,
//     Key: params
//   }

//   dynamodb.get(getItemParams,(err, data) => {
//     if(err) {
//       res.statusCode = 500;
//       res.json({error: 'Could not load items: ' + err.message});
//     } else {
//       if (data.Item) {
//         res.json(data.Item);
//       } else {
//         res.json(data) ;
//       }
//     }
//   });
// });


// /************************************
// * HTTP put method for insert object *
// *************************************/

// app.put(path, function(req, res) {

//   if (userIdPresent) {
//     req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   }

//   let putItemParams = {
//     TableName: tableName,
//     Item: req.body
//   }
//   dynamodb.put(putItemParams, (err, data) => {
//     if(err) {
//       res.statusCode = 500;
//       res.json({error: err, url: req.url, body: req.body});
//     } else{
//       res.json({success: 'put call succeed!', url: req.url, data: data})
//     }
//   });
// });

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});

// /**************************************
// * HTTP remove method to delete object *
// ***************************************/

// app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
//   var params = {};
//   if (userIdPresent && req.apiGateway) {
//     params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   } else {
//     params[partitionKeyName] = req.params[partitionKeyName];
//      try {
//       params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }
//   if (hasSortKey) {
//     try {
//       params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({error: 'Wrong column type ' + err});
//     }
//   }

//   let removeItemParams = {
//     TableName: tableName,
//     Key: params
//   }
//   dynamodb.delete(removeItemParams, (err, data)=> {
//     if(err) {
//       res.statusCode = 500;
//       res.json({error: err, url: req.url});
//     } else {
//       res.json({url: req.url, data: data});
//     }
//   });
// });
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
