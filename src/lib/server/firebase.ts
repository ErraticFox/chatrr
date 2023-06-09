import { FIREBASE_SERVER_CONFIG } from "$env/static/private";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import admin from "firebase-admin";
import type { Document } from "$lib/models/Document";

export function initializeFirebase() {
    if (!admin.apps.length) {
        const serviceAccount = JSON.parse(FIREBASE_SERVER_CONFIG);
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                privateKey: serviceAccount.private_key.replaceAll(/\\n/g, "\n"),
            }),
            databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
            storageBucket: `gs://${serviceAccount.project_id}.appspot.com`,
        });
    }
}

export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
    if (!token || token === "null" || token === "undefined") return null;
    try {
        initializeFirebase();
        admin
            .auth()
            .verifyIdToken(token)
            .catch((err) => console.log(err));
        const verifiedToken = await admin.auth().verifyIdToken(token);
         return verifiedToken;
    } catch (err) {
        return null;
    }
}

export async function getDocuments(collectionPath: string, uid: string): Promise<Array<Document>> {
    if (!uid) return [];
    initializeFirebase();
    const db = firestore;
    const querySnapshot = await db.collection(collectionPath).where("uid", "==", uid).get();
    const list: Array<Document> = [];
    querySnapshot.forEach((doc) => {
        const document: Document = <Document>doc.data(); // Just need the data on the server
        document._id = doc.id;
        list.push(document);
    });
    return list;
}

export async function createDocument(collectionPath: string, uid: string): Promise<Document> {
    initializeFirebase();
    const db = firestore;
    const doc = await (await db.collection(collectionPath).add({ uid })).get();

    const document = <Document>doc.data(); // Just need the data on the server
    document._id = doc.id;
    return document;
}
