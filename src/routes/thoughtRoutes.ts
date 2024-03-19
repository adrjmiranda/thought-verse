import Router from 'express';
import ThoughtController from '../controllers/ThoughtController';
import { ensureAuthenticated } from '../middlewares/authenticationMiddleware';
import { check } from 'express-validator';

const thoughtRouter = Router();

thoughtRouter.get('', ThoughtController.index);
thoughtRouter.post(
	'/create',
	ensureAuthenticated,
	[
		check('content')
			.notEmpty()
			.withMessage('You cannot publish an empty thought.')
			.isLength({ max: 255 })
			.withMessage('It cannot be longer than 255 characters.'),
	],
	ThoughtController.create
);

export default thoughtRouter;
