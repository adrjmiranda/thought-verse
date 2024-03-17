import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { validationResult, ValidationError, Result } from 'express-validator';
import { ErrorType } from '../types/error-type';
import { CustomSession } from '../interfaces/CustomSession';
import { Document, Types } from 'mongoose';
import User from '../interfaces/User';

export default class AuthController {
	static register(req: Request, res: Response): void {
		res.render('auth/register');
	}

	static login(req: Request, res: Response): void {
		res.render('auth/login');
	}

	static async store(req: Request, res: Response): Promise<void> {
		const { name, email, password, password_confirmation } = req.body;

		const result: Result<ValidationError> = validationResult(req);
		let errorsMessages: ErrorType[] = [];
		if (!result.isEmpty()) {
			for (const field in result.mapped()) {
				errorsMessages.push({
					type: field,
					msg: result.mapped()[field].msg,
				});
			}

			const userByEmail:
				| (Document<unknown, {}, User> &
						User & {
							_id: Types.ObjectId;
						})
				| null = await UserModel.findOne({ email }).exec();
			if (userByEmail) {
				errorsMessages.push({
					type: 'user_exists',
					msg: 'There is already a registered user with this email!',
				});
			}

			return res.render('auth/register', {
				errors: errorsMessages,
				fields: {
					name,
					email,
					password,
					password_confirmation,
				},
			});
		}

		try {
			const salt: string = await bcrypt.genSalt(
				parseInt(process.env.SALT_VALUE!)
			);
			const hash: string = await bcrypt.hash(password, salt);

			const user = new UserModel({
				name,
				email,
				password: hash,
			});

			const newUser = await user.save();

			(req.session as CustomSession).user = { id: newUser._id.toString() };

			res.redirect('/user/dashboard');
		} catch (error) {
			errorsMessages = [];
			errorsMessages.push({
				type: 'register_error',
				msg: 'Unable to complete user registration!',
			});

			res.render('auth/register', {
				errors: errorsMessages,
				fields: {
					name,
					email,
					password,
					password_confirmation,
				},
			});
		}
	}

	static async auth(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;

		const userByEmail:
			| (Document<unknown, {}, User> &
					User & {
						_id: Types.ObjectId;
					})
			| null = await UserModel.findOne({ email }).exec();

		const result: Result<ValidationError> = validationResult(req);
		let errorsMessages: ErrorType[] = [];
		if (!result.isEmpty()) {
			for (const field in result.mapped()) {
				errorsMessages.push({
					type: field,
					msg: result.mapped()[field].msg,
				});
			}

			if (!userByEmail) {
				errorsMessages.push({
					type: 'user_not_exists',
					msg: 'There is no registered user with this email!',
				});
			} else {
				const passwordIsCorrect = await bcrypt.compare(
					password,
					userByEmail.password
				);

				if (!passwordIsCorrect) {
					errorsMessages.push({
						type: 'incorrect_password',
						msg: 'The password entered is incorrect!',
					});
				}
			}

			return res.render('auth/login', {
				errors: errorsMessages,
				fields: {
					email,
					password,
				},
			});
		}

		if (userByEmail) {
			(req.session as CustomSession).user = { id: userByEmail._id.toString() };
			res.redirect('/user/dashboard');
		}
	}

	static logout(req: Request, res: Response): void {
		req.session.destroy((error) => {
			if (error) {
				console.error('Error destroying session:', error);
				res.status(500).send('Internal Server Error');
			} else {
				res.redirect('/');
			}
		});
	}
}
