declare const { UserSession, UserProfile, UserChatStatus, UserPresence }: import('$lib/models/types');

declare global {
	namespace App {
		interface Locals {
			userSession: UserSession | undefined;
		}
		interface PageData {
			userSession: UserSession;
			userProfile: UserProfile;
			userPresenceStatus: UserPresence;
			userChatStatus: UserChatStatus;
		}
	}
}

export {};
