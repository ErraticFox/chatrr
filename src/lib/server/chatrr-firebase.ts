import admin from 'firebase-admin';
import { initializeFirebase } from './firebase';
import type { UserChatStatus, UserPresenceStatus, UserProfile } from "$lib/models/types";
import { generateRandomUsername } from "$lib/utils";

export async function getUserProfile(uid: string): Promise<UserProfile> {
	initializeFirebase();
	const queryRef = firestore.collection('profiles').where("uid", "==", uid);
	const query = await queryRef.get()

	if (!query.empty) {
		const profile = query.docs[0].data() as UserProfile
		profile.created = profile.created.toDate()
		profile.updated = profile.updated.toDate()
		return profile;
	}

	const newProfileDoc = firestore.collection('profiles').doc()

	const profileObj: UserProfile = {
		_id: newProfileDoc.id,
		uid,
		created: admin.firestore.FieldValue.serverTimestamp(),
		updated: admin.firestore.FieldValue.serverTimestamp(),
		username: generateRandomUsername(),
		bio: ""
	}

	await newProfileDoc.create(profileObj)
	const newProfile = await (await newProfileDoc.get()).data() as UserProfile
	newProfile.created = newProfile.created.toDate()
	newProfile.updated = newProfile.updated.toDate()
	
	return newProfile
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

	await presenceRef.update(presenceObj)
	
	const newPresenceStatus = (await presenceRef.get()).toJSON() as UserPresenceStatus

	return newPresenceStatus;
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

	await chatStatusRef.update(chatStatusObj)

	const newChatStatus = (await chatStatusRef.get()).toJSON() as UserChatStatus

	return newChatStatus;
}