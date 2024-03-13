import { Document } from 'mongoose';

export default interface User extends Document {
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	image?: string;
}
