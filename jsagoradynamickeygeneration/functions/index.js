var functions = require('firebase-functions');
var express = require('express');
var AccessToken = require('agora-access-token');
const { response } = require('express');
var {Token, Priviledges} = AccessToken;
const cors = require('cors')({origin: true});


var PORT = process.env.PORT || 5000;

const APP_ID = '1bd8efc9739141a4a7830451d5087667';
const APP_CERTIFICATE = '4a1405b5fbe7497e9bd4431592710145';
const app = express();
// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

var generateAccessToken = function (req, resp) {
    resp.header('Access-Control-Allow-Origin', "*")

    var channel = req.query.channel;
    console.log('channel',channel);
    if (!channel) {
        return resp.status(500).json({ 'error': 'channel name is required' });
    }

    var uid = req.query.uid;
    if (!uid) {
        uid = 0;
    }
    console.log('uid',uid);
    var expiredTs = req.query.expiredTs;
    if (!expiredTs) {
        expiredTs = 0;
    }
    console.log('expiredTs',expiredTs);
    var token = new Token(APP_ID, APP_CERTIFICATE, channel, uid);
    // typically you will ONLY need join channel priviledge
    token.addPriviledge(Priviledges.kJoinChannel, expiredTs);
    return resp.json({ 'token': token.build() });
};

// app.get('/access_token?:uid&:channel&:expiredTs', nocache, generateAccessToken);
// app.get('/access_token', nocache, generateAccessToken,(req,resp) =>{
app.get('/access_token?:uid&:channel&:expiredTs', (request,response) =>{    
    console.log('expire',req.query.expiredTs);
    console.log('uid',req.query.uid);
    console.log('channel',req.query.channel);
    response.send(`${req.query.channel}`);
});

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });