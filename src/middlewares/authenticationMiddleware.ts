import { Request, Response, NextFunction } from 'express';
import { CustomSession } from '../interfaces/CustomSession';

export function ensureAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.session && (req.session as CustomSession).user) {
		next();
	} else {
		res.redirect('/auth/login');
	}
}
