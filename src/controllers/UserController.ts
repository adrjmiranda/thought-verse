import { Request, Response } from 'express';
import { CustomSession } from '../interfaces/CustomSession';
import { FlattenMaps } from 'mongoose';
import { Types } from 'mongoose';
import User from '../interfaces/User';
import UserModel from '../models/UserModel';

export default class UserController {
	static dashboard(req: Request, res: Response) {
		res.render('user/dashboard');
	}

	static async profile(req: Request, res: Response): Promise<void> {
		const id = (req.session as CustomSession).user?.id;

		if (id) {
			try {
				const user:
					| (FlattenMaps<User> & {
							_id: Types.ObjectId;
					  })
					| null = await UserModel.findById({ _id: id })
					.select('-password')
					.lean()
					.exec();

				if (user) {
					res.render('user/profile', { user });
				} else {
					res.status(400).send('User not found!');
				}
			} catch (error) {
				console.error('Error fetching user profile:', error);
				res.status(500).send('Internal Server Error');
			}
		} else {
			res.redirect('/user/login');
		}
	}

	static async editProfile(req: Request, res: Response): Promise<void> {
		const id = (req.session as CustomSession).user?.id;

		if (id) {
			try {
				const user:
					| (FlattenMaps<User> & {
							_id: Types.ObjectId;
					  })
					| null = await UserModel.findById({ _id: id })
					.select('-password')
					.lean()
					.exec();

				if (user) {
					res.render('user/edit-profile', { user });
				} else {
					res.status(400).send('User not found!');
				}
			} catch (error) {
				console.error('Error fetching user profile:', error);
				res.status(500).send('Internal Server Error');
			}
		} else {
			res.redirect('/user/login');
		}
	}
}
