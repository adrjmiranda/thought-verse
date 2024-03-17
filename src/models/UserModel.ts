import { Model, Schema } from 'mongoose';
import mongoose from '../db/conn';

import User from '../interfaces/User';

const userSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		image: {
			type: String,
		},
		bio: {
			type: String,
		},
	},
	{ timestamps: true }
);

const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
