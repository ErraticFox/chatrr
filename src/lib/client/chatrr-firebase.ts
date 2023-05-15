import { onDisconnect, onValue, ref, serverTimestamp, update } from "firebase/database";
import { db, fs, getDbObject } from "./firebase";
import { get } from "svelte/store";
import { page } from "$app/stores";
import type { ChatStatus, PresenceStatus, Room, UserChatStatus, UserPresenceStatus, UserProfile } from "$lib/models/types";
import { messagesStore, roomStore, userChatStatusStore, userPresenceStatusStore, userProfileStore } from "./stores";
import { collection, doc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import type { Document } from "$lib/models/Document";
import type { Message } from "$lib/models/Message";

// profile

export function listenToUserProfile() {
    const uid: string = get(page).data.userSession.uid;
    const profileRef = doc(fs, "profiles", uid);
    onSnapshot(profileRef, (snap) => {
        if (snap.exists()) {
            const profile = snap.data() as UserProfile;
            userProfileStore.set(profile);
        } else {
            userProfileStore.set(null);
        }
    });
}

// presence

export function initializeUserPresence() {
    setUserPresence("online");
    document.addEventListener("visibilitychange", () => {
        document.visibilityState === "visible" ? setUserPresence("online") : setUserPresence("away");
    });
    listenToUserPresenceStatus();
}

export function listenToUserPresenceStatus() {
    const uid: string = get(page).data.userSession.uid;
    const connectedRef = ref(db, ".info/connected");
    const userPresenceRef = ref(db, `userPresenceStatus/${uid}`);

    onValue(connectedRef, (snap) => {
        if (snap.val()) {
            const disconnectUpdate: UserPresenceStatus = {
                status: "offline",
                timestamp: serverTimestamp(),
                uid,
            };

            onDisconnect(userPresenceRef).update(disconnectUpdate);
        }
    });

    onValue(userPresenceRef, (snap) => {
        if (snap.exists()) userPresenceStatusStore.set(snap.val());
        else userPresenceStatusStore.set(null);
    });
}

export function setUserPresence(status: PresenceStatus) {
    const uid: string = get(page).data.userSession.uid;
    if (!uid) return;

    const userPresence = ref(db, `userPresenceStatus/${uid}`);

    const updateObj: UserPresenceStatus = {
        status,
        timestamp: serverTimestamp(),
        uid,
    };

    update(userPresence, updateObj);
}

// chat status

export function listenToUserChatStatus() {
    const uid: string = get(page).data.userSession.uid;
    const connectedRef = ref(db, ".info/connected");
    const userChatStatusRef = ref(db, `userChatStatus/${uid}`);

    onValue(connectedRef, (snap) => {
        if (snap.val()) {
            const disconnectUpdate: UserChatStatus = {
                status: "disconnected",
                timestamp: serverTimestamp(),
                uid,
            };

            onDisconnect(userChatStatusRef).update(disconnectUpdate);
        }
    });

    onValue(userChatStatusRef, (snap) => {
        if (snap.exists()) userChatStatusStore.set(snap.val());
        else userChatStatusStore.set(null);
    });
}

export function setUserChatStatus(status: ChatStatus) {
    const uid: string = get(page).data.userSession.uid;
    if (!uid) return;

    const userPresence = ref(db, `userChatStatus/${uid}`);

    const updateObj: UserChatStatus = {
        status,
        timestamp: serverTimestamp(),
        uid,
    };

    update(userPresence, updateObj);
}

// chat

export async function sendMessage(document: Document) {
    const dbObject = getDbObject(document) as Message;
    if (!document._collection) throw Error("Objects that extends Document must specify __collection");

    if (!dbObject._roomId) throw Error("Must provide room id");

    const collectionRef = collection(fs, document._collection, dbObject._roomId, "messages");
    const docRef = doc(collectionRef);
    dbObject._id = docRef.id;

    if (dbObject._id) {
        await setDoc(docRef, dbObject);
    }
}

export function listenForRoom(uid: string) {
    const roomRef = collection(fs, "rooms");
    const room = query(roomRef, where("users", "array-contains", uid));

    onSnapshot(room, async (roomSnap) => {
        if (roomSnap.size) {
            let room = roomSnap.docs[0].data() as Room;
            roomStore.set(room);
            listenForMessages(room._id);
        } else {
            roomStore.set(null);
        }
    });
}

export async function listenForMessages(roomId: string) {
    const messagesRef = collection(fs, "rooms", roomId, "messages");
    const queryRef = query(messagesRef, orderBy("timestamp", "desc"));

    messagesStore.set([]);

    onSnapshot(
        queryRef,
        (messagesSnap) => {
            let messages = messagesSnap.docs.map((doc) => doc.data()) as Array<Message>;
            if (messages[0]?.timestamp) {
                messages = messages.map((message) => {
                    message.timestamp = message.timestamp?.toMillis();
                    return message;
                });
                messagesStore.set(messages)
            }
        },
        (error) => {
            if (error.message !== "Missing or insufficient permissions.") console.error(error);
        }
    );
}
