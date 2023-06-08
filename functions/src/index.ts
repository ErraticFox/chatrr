import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { onValueUpdated } from "firebase-functions/v2/database";

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

exports.handleChat = onValueUpdated("userChatStatus/{uid}", (event) => {
    event.data.after.val()
})

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

                const roomRef = firestore.collection("rooms").doc();

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
            const query = await firestore.collection("rooms").where("users", "array-contains", prev.uid).get();
            if (query.docs) {
                const roomRef = query.docs[0].ref;
                const disconnectMessage = (await roomRef.collection("messages").doc("disconnect").get()).exists;
                if (!disconnectMessage) {
                    const uid = context.auth.uid;
                    const username = (await firestore.collection("profiles").where("uid", "==", uid).get()).docs[0].data().username;
                    await roomRef
                        .collection("messages")
                        .doc("disconnect")
                        .set({
                            message: `${username} has disconnected`,
                            timestamp: admin.firestore.FieldValue.serverTimestamp(),
                        });
                }
                const data = (await roomRef.get()).data();
                const peerId = data.users.filter((id) => id !== prev.uid);
                await admin.database().ref(`userChatStatus/${peerId}`).update({ status: "disconnected" });
                await firestore.recursiveDelete(roomRef);
            }
        }
    }

    return true;
});

export const handleOfflineAnon = functions.database.ref("userPresenceStatus/{uid}").onUpdate(async (snap, context) => {
    const next = snap.after.val();

    if (next.status === "offline") {
        console.log(context.auth.token["provider_id"]);
        if (context.auth.token["provider_id"] === "anonymous") {
            await (await firestore.collection("profiles").where("uid", "==", context.auth.uid).get()).docs[0].ref.delete();
            await admin.database().ref(`userPresenceStatus/${context.auth.uid}`).remove();
            await admin.database().ref(`userChatStatus/${context.auth.uid}`).remove();
            await admin.auth().deleteUser(context.auth.uid);
        }
    }

    return true;
});

// export const accountcleanup = onSchedule("every day 00:00", async (event) => {
//     // Fetch all user details.
//     // const inactiveUsers = await getInactiveUsers();

//     // // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
//     // const promisePool = new PromisePool(
//     //     () => deleteInactiveUser(inactiveUsers),
//     //     MAX_CONCURRENT,
//     // );
//     // await promisePool.start();

//   });
