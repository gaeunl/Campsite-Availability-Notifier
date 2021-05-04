const app = require('./app');

exports.handler = function (e, ctx, callback) {
    // TODO implement
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    app
    return response;
};
