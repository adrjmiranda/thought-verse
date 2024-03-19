import { Request, Response } from 'express';
import ThoughtModel from '../models/ThoughtModel';
import { CustomSession } from '../interfaces/CustomSession';
import { Result, ValidationError, validationResult } from 'express-validator';
import { ErrorType } from '../types/error-type';
import { Document, Types } from 'mongoose';
import UserModel from '../models/UserModel';
import User from '../interfaces/User';
import Thought from '../interfaces/Thought';

export default class ThoughtController {
	static async index(req: Request, res: Response): Promise<void> {
		try {
			const thoughts = await ThoughtModel.find()
				.sort({ createdAt: -1 })
				.lean()
				.exec();
			res.render('thought/index', { thoughts });
		} catch (error) {
			console.error('Error fetching thoughts:', error);
			res.status(500).send('Internal Server Error');
		}
	}

	static async create(req: Request, res: Response): Promise<void> {
		const { content } = req.body;
		const id = (req.session as CustomSession).user?.id;

		const userById:
			| (Document<unknown, {}, User> &
					User & {
						_id: Types.ObjectId;
					})
			| null = await UserModel.findById({ _id: id }).select('-password').exec();

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
					msg: 'The user does not exist.',
				});
			}

			return res.render('user/dashboard', {
				errors: errorsMessages,
				fields: {
					content,
				},
			});
		}

		try {
			let data = {
				content,
				user: {
					id: userById?._id,
					name: userById?.name,
					image: '',
				},
			};

			if (userById?.image) {
				data.user.image = userById?.image;
			}

			const newThought: Document<unknown, {}, Thought> &
				Thought & {
					_id: Types.ObjectId;
				} = new ThoughtModel(data);

			await newThought.save();

			req.flash('success', 'Thought published successfully!');
			res.redirect('/user/dashboard');
		} catch (error) {
			req.flash('error', 'Unable to publish your thoughts at this time.');
			res.redirect('/user/dashboard');
		}
	}
}
