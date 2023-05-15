export type AnyObject = Record<string, unknown>;
export type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;


export interface UserSession {
	name: string | undefined;
	email: string | undefined;
	uid: string | undefined;
}

export interface UserProfile {
	_id: string;
	uid: string;
	created: any;
	updated: any;
	username: string;
	bio: string;
}

export type PresenceStatus = "online" | "away" | "offline"

export interface UserPresenceStatus {
	status: PresenceStatus
	timestamp: object
	uid?: string
}

export type ChatStatus = "searching" | "connected" | "disconnected"

export interface UserChatStatus {
	status: ChatStatus
	timestamp: object
	uid?: string
}

export interface Room {
	_id: string;
	users: Array<string>;
}