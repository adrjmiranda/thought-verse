import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

export default class AuthController {
	static register(req: Request, res: Response) {
		res.render('auth/register');
	}

	static login(req: Request, res: Response) {
		res.render('auth/login');
	}
}
