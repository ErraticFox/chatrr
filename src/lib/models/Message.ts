import type { AnyObject } from '$lib/models/types';
import { serverTimestamp } from 'firebase/firestore';
import { Document } from './Document';

export class Message extends Document {
	constructor(data: AnyObject = {}) {
		super(data);
		this._load(data);
		this._dbFields.push('username');
		this._dbFields.push('message');
		this._dbFields.push('_roomId');
		this._dbFields.push('timestamp');
	}

	_collection: string = 'rooms';
	_roomId: string | undefined = '';
	username: string = '';
	message: string = '';
	timestamp: any = serverTimestamp();
}
