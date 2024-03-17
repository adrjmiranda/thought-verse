import { SessionData } from 'express-session';

export interface CustomSession extends SessionData {
	user?: { id: string };
}
