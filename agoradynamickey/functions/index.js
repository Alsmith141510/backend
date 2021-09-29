const functions = require('firebase-functions');
const express = require('express')
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')
const cors = require('cors',({origin: true}));

const getTokenforeducationapp = express();


const APP_ID = '1bd8efc9739141a4a7830451d5087667';
const APP_CERTIFICATE = '4a1405b5fbe7497e9bd4431592710145';

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}
const generateAccessToken = function (request, response) {
    response.header('Access-Control-Allow-Origin', "*")

    var channelName = request.query.channel;
    console.log('channel',channelName);
    if (!channelName) {
        return response.status(500).json({ 'error': 'channel name is required' });
    }

    var uid = request.query.uid;
    if (!uid) {
        uid = 0;
    }
    console.log('uid',uid);
    var expiredTs = request.query.expiredTs;
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const role = RtcRole.PUBLISHER;
    var privilegeExpiredTs = 0;
    // if (!expiredTs) {
    //     privilegeExpiredTs  = currentTimestamp + 3600;
    // } else {
    //     privilegeExpiredTs  = currentTimestamp + expiredTs;
    // }
    console.log('expiredTs',expiredTs);
    // var token = new Token(APP_ID, APP_CERTIFICATE, channel, uid);
    var token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);

    // typically you will ONLY need join channel priviledge
    // token.addPriviledge(Priviledges.kJoinChannel, expiredTs);
    console.log('token',token);
    return response.json({ 'token': token });
};

// app.get('/timestamp',(request, response) => {
//     response.send(`${Date.now()}`);
// });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

getTokenforeducationapp.get('/access_token',nocache,generateAccessToken, (request, response) => {
    console.log('expire',request.query.expiredTs);
    console.log('uid',request.query.uid);
    console.log('channel',request.query.channel);
  //  response.send(`${request.query.channel}`);
   response.json(`${Date.now() +':' + request.query.channel+':'+request.query.uid+':'+request.query.expiredTs}`);
});

// ,nocache, generateAccessToken,

exports.getTokenforeducationapp = functions.https.onRequest(getTokenforeducationapp);
