import admin from 'firebase-admin';
import { initializeFirebase } from './firebase';
import type { UserChatStatus, UserPresenceStatus, UserProfile } from "$lib/models/types";
import { generateRandomUsername } from "$lib/utils";

export async function getUserProfile(uid: string): Promise<UserProfile> {
	initializeFirebase();
	const queryRef = admin.firestore().collection('profiles').where("uid", "==", uid);
	const query = await queryRef.get()

	if (!query.empty) {
		const profile = query.docs[0].data() as UserProfile
		profile.created = profile.created.seconds
		profile.updated = profile.updated.seconds
		return profile;
	}

	const newProfileDoc = admin.firestore().collection('profiles').doc()

	const profileObj: UserProfile = {
		_id: newProfileDoc.id,
		uid,
		created: admin.firestore.FieldValue.serverTimestamp(),
		updated: admin.firestore.FieldValue.serverTimestamp(),
		username: generateRandomUsername(),
		bio: ""
	}

	newProfileDoc.create(profileObj)
	profileObj.created = profileObj.created.seconds
	profileObj.updated = profileObj.updated.seconds

	return profileObj
}

export async function getUserPresenceStatus(uid: string): Promise<UserPresenceStatus> {
	initializeFirebase();
	const presenceRef = admin.database().ref(`userPresenceStatus/${uid}`);
	const presence = await presenceRef.get()

	if (presence.exists()) {
		return presence.toJSON() as UserPresenceStatus;
	}

	const presenceObj: UserPresenceStatus = {
		status: "offline",
		timestamp: admin.database.ServerValue.TIMESTAMP
	}

	presenceRef.set(presenceObj)

	return presenceObj;
}

export async function getUserChatStatus(uid: string): Promise<UserChatStatus> {
	initializeFirebase();
	const chatStatusRef = admin.database().ref(`userChatStatus/${uid}`);
	const chatStatus = await chatStatusRef.get()

	if (chatStatus.exists()) {
		return chatStatus.toJSON() as UserChatStatus;
	}

	const chatStatusObj: UserChatStatus = {
		status: "disconnected",
		timestamp: admin.database.ServerValue.TIMESTAMP
	}

	chatStatusRef.set(chatStatusObj)

	return chatStatusObj;
}