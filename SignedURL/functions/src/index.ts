import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as AWS from 'aws-sdk';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//const functions = require('firebase-functions');
//const admin = require('firebase-admin');
//admin.initializeApp();
// const AWS = require('aws-sdk');

exports.getS3SignedUrlUpload = functions.https.onCall((data, context) => {
  AWS.config.update({
    accessKeyId: "YOUR_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
    region: "YOUR_AWS_REGION" // (e.g. :)"eu-west-1"
  });
  const s3 = new AWS.S3();
const s3Params = {
    Bucket: data.S3BucketName,
    Key: data.key,
    Expires: 600, // Expires in 10 minutes
    ContentType: data.contentType,
    ACL: 'public-read', // Could be something else
    ServerSideEncryption: 'AES256'
  };
return s3.getSignedUrl('putObject', s3Params);
});