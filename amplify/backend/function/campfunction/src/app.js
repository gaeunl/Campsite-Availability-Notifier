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
const nodemailer = require('nodemailer');
const gmail = require('./password');

AWS.config.update({ region: process.env.TABLE_REGION });

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

/************************************
* HTTP post method for insert object *
*************************************/
var emailData = `<h1>This is a Confirmation Email</h1>
  <p>We just got your request.<br>
  We will send you an email once the campsite is available<br><br>
  Have A Good One!<br><br><br></p>`;
app.post(path, function(req, res) {
  const camp = req.body;

  //create reusable transporter object using the default SMPT transport
  var transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: gmail.email,
      pass: gmail.password
    },
    secure: true,
  });
  var mailOptions = {
    from: 'camphelperdonotreply@gmail.com',
    to: camp.email,
    subject: `This is a confirmation email for submitted campsite: ${camp.campName}`,
    html: emailData + `<p><br>Requested Data<br>Name of Campsite:  ${camp.campName} <br> Date: ${camp.date} <br> length: ${camp.night}<p>`
  };
   console.log(emailData);
  
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("Mail Error",error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
  // send mail with defined transport object
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
