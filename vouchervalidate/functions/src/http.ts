import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


// The Firebase Admin SDK to access Cloud Firestore.
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const voucherValidate = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});