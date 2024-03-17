import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { validationResult, ValidationError, Result } from 'express-validator';
import { ErrorType } from '../types/error-type';
import { CustomSession } from '../interfaces/CustomSession';

export default class AuthController {
	static register(req: Request, res: Response): void {
		res.render('auth/register');
	}

	static login(req: Request, res: Response): void {
		res.render('auth/login');
	}

	static async store(req: Request, res: Response) {
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

			const userByEmail = await UserModel.findOne({ email }).exec();
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
			console.log(error);
			errorsMessages = [];
			errorsMessages.push({
				type: 'register_error',
				msg: 'Unable to complete user registration!',
			});

			res.render('auth/register', {
				errors: errorsMessages,
			});
		}
	}
}
