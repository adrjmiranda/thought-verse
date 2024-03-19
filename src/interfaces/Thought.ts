import { Document, Types } from 'mongoose';

export default interface Thought extends Document {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		id: Types.ObjectId;
		image?: string;
		name: string;
	};
}
