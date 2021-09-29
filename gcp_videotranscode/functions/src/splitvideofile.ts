// Imports the Google Cloud client library
  //  const speech = require('@google-cloud/speech');

  import * as functions from 'firebase-functions';
  import * as admin from 'firebase-admin';
  import * as Storage from '@google-cloud/storage';
  import * as gcsSpeech from '@google-cloud/speech';
  import * as fs from 'fs';
  import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
  import * as ffmpeg from 'fluent-ffmpeg';
