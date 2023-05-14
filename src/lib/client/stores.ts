import type { UserChatStatus, UserPresenceStatus, UserProfile } from '$lib/models/types';
import { writable, type Writable } from 'svelte/store';

export const initializedListeners: Writable<boolean> = writable();

export const userProfileStore: Writable<UserProfile | null> = writable();
export const userPresenceStatusStore: Writable<UserPresenceStatus | null> = writable();
export const userChatStatusStore: Writable<UserChatStatus | null> = writable();
