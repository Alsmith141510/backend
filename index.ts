import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";
import { join, basename, dirname } from "path"; // to join the path from different locations
import * as sharp from "sharp"; // promise based library to work with images.

const gcs = new Storage();
const os = require("os");

// storage functions will be triggered everytime a file is created.
// This will create an infinite loop.
// So it is highly incumbent upon us to create the logic which is triggered only once ala.. termination point.

export const resizeCourseImage = functions.storage
  .object()
  .onFinalize(async (object) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath?.split("/").pop();
    const tmpFilePath = join(os.tmpdir(), basename(filePath!));
    const courseFileName = "courseImg" + fileName;
    const coursethumbName = "courseImg" + fileName;
    const tmpCardCoursePath = join(os.tmpdir(), courseFileName);
    const tmpthumbCoursePath = join(os.tmpdir(), coursethumbName);
    //if (object. === 'not_exists') {
    //     console.log('We deleted a file, exit...');
    //     return;
    // }

    // This line will have a termination point for the infinite loop call.
    if (fileName?.includes("courseCardImg") || fileName?.includes("coursethumb") || !object.contentType?.includes('image')) {
      console.log("exiting from the resize function");
      return false;
    }

    await bucket.file(filePath!).download({
      destination: tmpFilePath
    });

    // card Image for courses.
    await sharp(tmpFilePath).resize(170, 330).toFile(tmpCardCoursePath);

    // Thumb Image for courses.
    await sharp(tmpFilePath).resize(170, 330).toFile(tmpthumbCoursePath);

    return bucket.upload(tmpCardCoursePath, {
      destination: join(dirname(filePath!), courseFileName)
    });
  });
