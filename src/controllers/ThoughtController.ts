import { Request, Response } from 'express';
import ThoughtModel from '../models/ThoughtModel';

export default class ThoughtController {
	static async index(req: Request, res: Response): Promise<void> {
		try {
			const thoughts = await ThoughtModel.find().exec();
			res.render('thought/index', { thoughts });
		} catch (error) {
			console.error('Error fetching thoughts:', error);
			res.status(500).send('Internal Server Error');
		}
	}
}
