import type { UserSession, UserProfile, UserPresence, UserChatStatus } from "$lib/models/types";

declare global {
    namespace App {
        interface Locals {
            userSession: UserSession;
        }

        interface PageData {
            userSession?: UserSession;
            userProfile?: UserProfile;
            userPresenceStatus?: UserPresence;
            userChatStatus?: UserChatStatus;
        }
    }
}

export {};
