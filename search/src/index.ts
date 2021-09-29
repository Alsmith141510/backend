import * as functions from 'firebase-functions';
import {initializeApp, credential, firestore} from 'firebase-admin';
import {MiscUtils} from "./utils/misc.utils";
import {Filters} from "./interfaces";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript//

initializeApp({
    credential: credential.applicationDefault(),
    databaseURL: 'https://tachanytime.firebaseio.com'
});

const DB = firestore();

export const search = functions.https.onRequest((request, response) => {
    response.header('Content-Type', 'application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    const Utils: MiscUtils = new MiscUtils();

    let keys = request.body.keys;
    const filters: Filters = request.body.filters;
    const LIMIT: number = request.body.limit;
    const results: any[] = [];

    if (keys && keys.length) {
        if (typeof keys === "string") {
            keys = [keys];
        }

        DB.collection('courseMaster')
            .limit(LIMIT ? LIMIT : 200)
            .get()
            .then((snapshot: any[]) => {
                snapshot.forEach(result => {
                    const C = result.data();
                    const searchableString = `${C["course Name"]} ${C["course.schoolName"]} ${C["course.Teacher[teachername]"]} ${C["course Description"]} ${C["category"]} ${C["subCategory"]} ${C["domainName"]} ${C["whatyouwilllearn"]} ${C["prerequisite"]} ${C["whoisitFor"]}`.trim().toLowerCase();
                    let score = 0;

                    keys.forEach((key: string) => {
                        score += Utils.countSubstring(searchableString, key.toLowerCase());
                    });

                    if (score) {
                        results.push({
                            ...C,
                            score
                        });
                    }
                });

                if (filters) {
                    MiscUtils.filterResults(results, filters, results1 => {
                        response.status(200).json(results1.sort((a, b) => b.score - a.score));
                    })
                } else {
                    response.status(200).json(results.sort((a, b) => b.score - a.score));
                }
            })
            .catch((reason: any) => {
                console.log('reason' + reason);
                response.status(200).json([]);
            })
    } else {
        response.status(200).json([]);
    }
});
