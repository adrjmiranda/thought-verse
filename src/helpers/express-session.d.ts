import 'express-session';

import { UserSession } from '../types/user-session';

declare module 'express-session' {
	interface SessionData {
		user?: UserSession;
	}
}
