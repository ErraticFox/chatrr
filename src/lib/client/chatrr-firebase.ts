import { onDisconnect, onValue, ref, serverTimestamp, update } from 'firebase/database';
import { db, fs } from './firebase';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import type {
	ChatStatus,
	PresenceStatus,
	UserChatStatus,
	UserPresenceStatus,
	UserProfile
} from '$lib/models/types';
import { userChatStatusStore, userPresenceStatusStore, userProfileStore } from './stores';
import { doc, onSnapshot } from 'firebase/firestore';

// profile

export function listenToUserProfile() {
	const uid: string = get(page).data.userSession.uid;
	const profileRef = doc(fs, 'profiles', uid);
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
	setUserPresence('online');
	document.addEventListener('visibilitychange', () => {
		document.visibilityState === 'visible' ? setUserPresence('online') : setUserPresence('away');
	});
	listenToUserPresenceStatus();
}

export function listenToUserPresenceStatus() {
	const uid: string = get(page).data.userSession.uid;
	const connectedRef = ref(db, '.info/connected');
	const userPresenceRef = ref(db, `userPresenceStatus/${uid}`);

	onValue(connectedRef, (snap) => {
		if (snap.val()) {
			const disconnectUpdate: UserPresenceStatus = {
				status: 'offline',
				timestamp: serverTimestamp()
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
		timestamp: serverTimestamp()
	};

	update(userPresence, updateObj);
}

// chat status

export function listenToUserChatStatus() {
	const uid: string = get(page).data.userSession.uid;
	const connectedRef = ref(db, '.info/connected');
	const userChatStatusRef = ref(db, `userChatStatus/${uid}`);

	onValue(connectedRef, (snap) => {
		if (snap.val()) {
			const disconnectUpdate: UserChatStatus = {
				status: 'disconnected',
				timestamp: serverTimestamp()
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
		timestamp: serverTimestamp()
	};

	update(userPresence, updateObj);
}
