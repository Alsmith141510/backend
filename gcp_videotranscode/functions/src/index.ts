import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import {gcsSpeech} from '@google-cloud/speech';
import { join, dirname } from "path"; // to join the path from different locations
import { tmpdir } from "os";
import { uuid} from 'uuidv4';


admin.initializeApp();
const gcs = new Storage();

export const createTranscribeVTT = functions.storage
  .object()
  .onFinalize(async (object) => {
    console.log("Bucket Info:" + object.bucket);

    const bucket = gcs.bucket(object.bucket); // get the uploaded bucket.
    const filePath = object.name;
    const contentType = object.contentType; // File content type
    const contentDisposition = object.contentDisposition; //Content disposition
    const cacheControl = object.cacheControl;
    const contentEncoding = object.contentEncoding;
    const contentLanguage = object.contentLanguage;

    console.log("Bucket filePath:" + filePath);
    const fileName = filePath?.split("/").pop();
    console.log("Bucket fileName:" + fileName);

    if (fileName?.includes("courseVideo_")) {
        console.log("exiting from the resize function");
        return false;
      }

      //Type Checking for the uploaded item
        if(object.contentType !== 'video/webm'){
        console.log('File name ', fileName, 'is not a webm video. Skipping')
        return
    }
    const tmpFilePath = join(tmpdir(), fileName!);
    console.log("Bucket tmpFilePath:" + tmpFilePath);
    const courseFileName = "courseVideo_" + fileName;
    const tmpCardCoursePath = join(tmpdir(), courseFileName);

    const metadata = {
        contentType: contentType,
        contentDisposition: contentDisposition,
        cacheControl: cacheControl,
        contentEncoding: contentEncoding,
        contentLanguage: contentLanguage,
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        }
        };
      console.log("Bucket tmpCardCoursePath:" + tmpCardCoursePath);
        // This line will have a termination point for the infinite loop call.|| !object.contentType?.includes('image')


    
      await bucket.file(filePath!).download({
        destination: tmpFilePath,
      });

  });
