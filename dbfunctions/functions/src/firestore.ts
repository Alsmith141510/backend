import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();


const db = admin.firestore();

export const  courseReviewsCreateFun =  functions.firestore
                         .document('courseReviews/{courseID}')
                         .onCreate( async (snapshot,context) => {
                             const coursedata = snapshot.data();
                             const courseMasterRef = db.doc('courseMaster/${coursedata.courseID}')

                             const courseMasterSnap = await courseMasterRef.get();
                             const courseMasterData = courseMasterSnap.data();

                             if (courseMasterData) {
                                return courseMasterRef.update( {
                                courseRating: ( courseMasterData.courseRating + coursedata.rating)/2,
                                courseQuality: ( courseMasterData.courseQuality + coursedata.courseQuality)/2,
                                courseValue: ( courseMasterData.courseValue + coursedata.courseValue)/2
                                
                             });
                            } else {
                                return null;
                            }

                         })

export const vouchervalidate = functions.https
                            .onCall( async(data, context) => {
                                const uid = context.auth?.uid;
                                
                                if (uid !== null ) {
                                const voucherCode = data.voucherCode;

                                return 'Received: ' + voucherCode;
                                } else {
                                    return 'Empty string';
                                }
                            })
                         


                        



