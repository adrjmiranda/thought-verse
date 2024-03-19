import { Request, Response } from 'express';
import { CustomSession } from '../interfaces/CustomSession';
import bcrypt from 'bcrypt';
import { FlattenMaps } from 'mongoose';
import { Types } from 'mongoose';
import fs from 'fs';
import User from '../interfaces/User';
import UserModel from '../models/UserModel';
import { Document } from 'mongoose';
import { ErrorType } from '../types/error-type';
import { Result, ValidationError, validationResult } from 'express-validator';
import path from 'path';

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

	static async update(req: Request, res: Response): Promise<void> {
		const { name, bio, password, password_confirmation } = req.body;
		const file = req.file;

		const id = (req.session as CustomSession).user?.id;

		const userById:
			| (FlattenMaps<User> & {
					_id: Types.ObjectId;
			  })
			| null = await UserModel.findById({ _id: id })
			.select('-password')
			.lean()
			.exec();

		const result: Result<ValidationError> = validationResult(req);
		let errorsMessages: ErrorType[] = [];
		if (!result.isEmpty()) {
			for (const field in result.mapped()) {
				errorsMessages.push({
					type: field,
					msg: result.mapped()[field].msg,
				});
			}

			if (!userById) {
				errorsMessages.push({
					type: 'user_not_exists',
					msg: 'This user does not exist!',
				});
			}

			return res.render('user/edit-profile', {
				errors: errorsMessages,
				user: userById,
			});
		}

		try {
			let data: object = { name, bio };

			if (password) {
				const salt: string = await bcrypt.genSalt(
					parseInt(process.env.SALT_VALUE!)
				);
				const hash: string = await bcrypt.hash(password, salt);

				data = { ...data, password: hash };
			}

			if (file) {
				const filePath = file.path;

				const destinationDir = `public/img/users/${id}/`;

				if (!fs.existsSync(destinationDir)) {
					fs.mkdirSync(destinationDir, { recursive: true });
				}

				if (userById?.image) {
					const oldImagePath = path.join(destinationDir, userById.image);
					if (fs.existsSync(oldImagePath)) {
						fs.unlinkSync(oldImagePath);
					}
				}

				const newFilePath = path.join(destinationDir, file.filename);

				fs.renameSync(filePath, newFilePath);

				const image = file.filename;

				data = { ...data, image };
			}

			const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
				new: true,
			});

			res.redirect('/user/profile');
		} catch (error) {
			errorsMessages = [];
			errorsMessages.push({
				type: 'update_error',
				msg: 'Unable to update user!',
			});

			res.render('user/edit-profile', {
				errors: errorsMessages,
				user: userById,
			});
		}
	}
}
