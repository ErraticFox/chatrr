import type { Message } from "$lib/models/Message";
import type { Room, UserChatStatus, UserPresenceStatus, UserProfile } from "$lib/models/types";
import { writable, type Writable } from "svelte/store";

export const loading: Writable<boolean> = writable(true);

export const initializedListeners: Writable<boolean> = writable();

export const userProfileStore: Writable<UserProfile | null> = writable();
export const userPresenceStatusStore: Writable<UserPresenceStatus | null> = writable();
export const userChatStatusStore: Writable<UserChatStatus | null> = writable();

export const roomStore: Writable<Room | null> = writable();
export const peerProfileStore: Writable<UserProfile | null> = writable();
export const peerPresenceStore: Writable<UserPresenceStatus | null> = writable();
export const messagesStore: Writable<Array<Message>> = writable([]);

export const loadingChat: Writable<boolean> = writable();