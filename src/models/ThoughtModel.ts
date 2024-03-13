import { Model, Schema } from 'mongoose';
import mongoose from '../db/conn';

import Thought from '../interfaces/Thought';

const thoughtSchema: Schema = new Schema(
	{
		content: { type: String, required: true },
		user: {
			name: { type: String, required: true },
			id: { type: Schema.Types.ObjectId, required: true },
		},
	},
	{ timestamps: true }
);

const ThoughtModel: Model<Thought> = mongoose.model<Thought>(
	'Thought',
	thoughtSchema
);

export default ThoughtModel;
