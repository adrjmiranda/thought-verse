import { Request, Response } from 'express';

export default class UserController {
	static dashboard(req: Request, res: Response) {
		res.render('user/dashboard');
	}

	static profile(req: Request, res: Response) {
		res.render('user/profile');
	}
}
