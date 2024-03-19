import Router from 'express';
import { ensureAuthenticated } from '../middlewares/authenticationMiddleware';
import UserController from '../controllers/UserController';
import upload from '../helpers/img-upload';
import { body, check } from 'express-validator';

const userRouter = Router();

userRouter.get('/dashboard', ensureAuthenticated, UserController.dashboard);
userRouter.get('/profile', ensureAuthenticated, UserController.profile);
userRouter.get(
	'/user-profile/:id',
	ensureAuthenticated,
	UserController.userProfile
);
userRouter.get(
	'/edit-profile',
	ensureAuthenticated,
	UserController.editProfile
);
userRouter.post(
	'/update',
	ensureAuthenticated,
	upload,
	[
		check('name')
			.notEmpty()
			.withMessage('The name is mandatory.')
			.matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/)
			.withMessage('The name must contain only letters and spaces.'),
		body('bio')
			.optional({ checkFalsy: true })
			.isLength({ max: 255 })
			.withMessage('The bio must have a maximum of 255 characters.'),
		body('password')
			.optional({ checkFalsy: true })
			.isLength({ min: 8, max: 20 })
			.withMessage('The password must be 8 to 20 characters long.')
			.isAlphanumeric()
			.withMessage('The password can only contain letters and numbers.'),
		check('password_confirmation')
			.optional({ checkFalsy: true })
			.isLength({ min: 8, max: 20 })
			.withMessage('The password must be 8 to 20 characters long.')
			.isAlphanumeric()
			.withMessage('The password can only contain letters and numbers.')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Password confirmation does not match password');
				}
				return true;
			}),
	],
	UserController.update
);

export default userRouter;
