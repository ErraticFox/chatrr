import { getUserChatStatus, getUserPresenceStatus, getUserProfile } from "$lib/server/chatrr-firebase";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    const { userSession } = locals;

    if (userSession) {
        const userProfile = await getUserProfile(userSession.uid);
        const userPresenceStatus = await getUserPresenceStatus(userSession.uid);
        const userChatStatus = await getUserChatStatus(userSession.uid);
        return { userSession, userProfile, userPresenceStatus, userChatStatus };
    }

    return { userSession };
};
