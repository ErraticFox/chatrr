import type { UserPresenceStatus } from "$lib/models/types";
import { getUserChatStatus, getUserPresenceStatus, getUserProfile } from '$lib/server/chatrr-firebase';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { userSession } = locals;

	if (userSession) {
		const userProfile = await getUserProfile(userSession.uid)
		const userPresenceStatus = await getUserPresenceStatus(userSession.uid);
		const userChatStatus = await getUserChatStatus(userSession.uid);
		if (typeof userChatStatus.timestamp === "number" || typeof userPresenceStatus === "number") {
			return { userSession, userProfile, userPresenceStatus, userChatStatus };
		}
	}

	return { userSession };
};
