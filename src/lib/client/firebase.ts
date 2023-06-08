import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getDatabase, type Database, connectDatabaseEmulator } from "firebase/database";
import { collection, getFirestore, query, where, addDoc, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import {
    getAuth,
    signInWithRedirect,
    signOut as _signOut,
    GoogleAuthProvider,
    onIdTokenChanged,
    signInAnonymously,
    connectAuthEmulator,
    type Auth,
} from "firebase/auth";
import type { Document } from "$lib/models/Document";
import { readable } from "svelte/store";
import { browser, dev } from "$app/environment";
import type { AnyObject } from "$lib/models/types";
import { invalidateAll } from "$app/navigation";
import { loading, peerProfileStore, roomStore, userChatStatusStore, userPresenceStatusStore, userProfileStore } from "./stores";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";

async function setToken(token: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ token }),
    };

    await fetch("/api/token", options);
}

function listenForAuthChanges() {
    const auth = getAuth(app);

    onIdTokenChanged(
        auth,
        async (user) => {
            if (user) {
                const token = await user.getIdToken();
                await setToken(token);
            } else {
                await setToken("");
            }
            await invalidateAll();
        },
        (err) => console.error(err.message)
    );
}

export let app: FirebaseApp;
export let auth: Auth;
export let fs: Firestore;
export let db: Database;
export let fn: Functions;
export function initializeFirebase(options: FirebaseOptions) {
    if (!browser) {
        throw new Error("Can't use the Firebase client on the server.");
    }
    if (!app) {
        app = initializeApp(options);
        auth = getAuth(app);
        fs = getFirestore(app);
        db = getDatabase(app);
        fn = getFunctions(app)
        listenForAuthChanges();

        if (dev) {
            connectAuthEmulator(auth, "http://localhost:9099");
            connectFunctionsEmulator(fn, "localhost", 5001);
            connectDatabaseEmulator(db, "localhost", 9000)
            connectFirestoreEmulator(fs, "localhost", 8080);
        }
    }
}

export function getDbObject(document: Document): Partial<Document> {
    const obj: AnyObject = {};
    Object.keys(document)
        .filter((k) => document._dbFields.includes(k))
        .forEach((k) => {
            obj[k] = document[k as keyof Document];
        });
    return obj;
}

export async function saveDocument(document: Document) {
    const dbObject = getDbObject(document);
    if (!document._collection) throw Error("Objects that extends Document must specify __collection");

    if (document._id) {
        await setDoc(doc(fs, document._collection, document._id), dbObject);
    } else {
        const todoRef = await addDoc(collection(fs, document._collection), dbObject);
        document._id = todoRef.id;
    }
}

export function getDocumentStore<T extends Document>(
    type: { new (data: AnyObject): T },
    document: T,
    onDeleted: () => void = () => undefined
) {
    return readable<T>(document, (set) => {
        let dbUnsubscribe: () => void;
        let unsubbed = false;
        const unsub = () => {
            unsubbed = true;
            if (dbUnsubscribe) {
                dbUnsubscribe();
            }
        };
        if (browser) {
            (async () => {
                if (unsubbed) return;
                dbUnsubscribe = onSnapshot(doc(fs, document._collection, document._id), (doc) => {
                    if (doc.exists()) {
                        const newDoc = new type(doc.data());
                        newDoc._id = doc.id;
                        set(newDoc);
                    } else {
                        onDeleted();
                        dbUnsubscribe();
                    }
                });
            })();
        }

        return unsub;
    });
}

function providerFor(name: string) {
    switch (name) {
        case "google":
            return new GoogleAuthProvider();
        default:
            throw "unknown provider " + name;
    }
}

export async function signInWith(name: string) {
    const auth = getAuth(app);
    if (name === "anonymous") {
        await signInAnonymously(auth);
        loading.set(true);
        return;
    } else {
        const provider = providerFor(name);
        await signInWithRedirect(auth, provider);
    }
}

export async function signOut() {
    const auth = getAuth(app);
    await _signOut(auth);
}

export async function deleteDocument(document: Document) {
    if (!document._collection) throw Error("Objects that extends Document must specify __collection");

    await deleteDoc(doc(fs, document._collection, document._id));
}

export function getCollectionStore<T extends Document>(
    type: { new (data: AnyObject): T },
    collectionPath: string,
    uid: string,
    initialData: Array<T> = []
) {
    return readable<Array<T>>(initialData, (set) => {
        let dbUnsubscribe: () => void;
        let unsubbed = false;
        const unsub = () => {
            unsubbed = true;
            if (dbUnsubscribe) {
                dbUnsubscribe();
            }
        };
        if (browser) {
            (async () => {
                if (unsubbed) return;
                const q = query(collection(fs, collectionPath), where("uid", "==", uid));
                dbUnsubscribe = onSnapshot(q, (docs) => {
                    const newDocuments: Array<T> = [];
                    docs.forEach((doc) => {
                        const newDoc = new type(doc.data());
                        newDoc._id = doc.id;
                        newDocuments.push(newDoc);
                    });
                    set(newDocuments);
                });
            })();
        }

        return unsub;
    });
}
