import * as functions from "firebase-functions";
import * as admin from "firebase-admin"

admin.initializeApp(functions.config().firebase);

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const connectDisconnect = functions.database.ref('userChatStatus/{uid}').onUpdate(async (snap, context) => {

    const prev = snap.before.val()
    const next = snap.after.val()

    if (prev.status !== next.status) {

        if (next.status === "searching") {
            const searchingUsers = (await admin.database().ref("userChatStatus").orderByChild("status").equalTo("searching").get()).val() || {}
            delete searchingUsers[context.auth?.uid]
            const keys = Object.keys(searchingUsers)

            const randomPeer = searchingUsers[keys[Math.floor(keys.length * Math.random())]]

            if (randomPeer) {
                admin.database().ref(`userChatStatus/${randomPeer.uid}`).update({ status: "connected" })
                admin.database().ref(`userChatStatus/${context.auth.uid}`).update({ status: "connected" })

                const roomRef = admin.firestore().collection('rooms').doc()

                roomRef.create({
                    _id: roomRef.id,
                    users: [randomPeer.uid, context.auth.uid]
                })
            }
        }

    }
    
    if (prev.connected !== next.connected) {

        if (!next.connected) {
            const query = await admin.firestore().collection('rooms').where('users', 'array-contains', prev.uid).get()
            if (query.docs) {
                const roomRef = query.docs[0].ref
                const data = (await roomRef.get()).data()
                const peerId = data.users.filter(id => id !== prev.uid)
                admin.database().ref(`userChatStatus/${peerId}`).update({ status: "disconnected" })
                admin.firestore().recursiveDelete(roomRef)
            }
        }
        
    }

    return ''
})
