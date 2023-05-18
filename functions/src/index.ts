import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const connectDisconnect = functions.database.ref("userChatStatus/{uid}").onUpdate(async (snap, context) => {
    const prev = snap.before.val();
    const next = snap.after.val();

    if (prev.status !== next.status) {
        if (next.status === "searching") {
            const searchingUsers =
                (await admin.database().ref("userChatStatus").orderByChild("status").equalTo("searching").get()).val() || {};
            delete searchingUsers[context.auth?.uid];
            const keys = Object.keys(searchingUsers);

            const randomPeer = searchingUsers[keys[Math.floor(keys.length * Math.random())]];

            if (randomPeer) {
                await admin.database().ref(`userChatStatus/${randomPeer.uid}`).update({ status: "connected" });
                await admin.database().ref(`userChatStatus/${context.auth.uid}`).update({ status: "connected" });

                const roomRef = admin.firestore().collection("rooms").doc();

                await roomRef.create({
                    _id: roomRef.id,
                    users: [randomPeer.uid, context.auth.uid],
                });

                await roomRef.collection("messages").add({
                    message: "user has connected",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        }

        if (prev.status === "connected" && next.status === "disconnected") {
            const query = await admin.firestore().collection("rooms").where("users", "array-contains", prev.uid).get();
            if (query.docs) {
                const roomRef = query.docs[0].ref;
                const disconnectMessage = (await roomRef.collection("messages").doc("disconnect").get()).exists;
                if (!disconnectMessage) {
                    const uid = context.auth.uid
                    const username = (await admin.firestore().collection("profiles").where("uid", "==", uid).get()).docs[0].data().username;
                    await roomRef.collection("messages").doc("disconnect").set({
                        message: `${username} has disconnected`,
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                const data = (await roomRef.get()).data();
                const peerId = data.users.filter((id) => id !== prev.uid);
                await admin.database().ref(`userChatStatus/${peerId}`).update({ status: "disconnected" });
                await admin.firestore().recursiveDelete(roomRef);
            }
        }
    }

    return "";
});
