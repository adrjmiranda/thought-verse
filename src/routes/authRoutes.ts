import Router from 'express';
import AuthController from '../controllers/AuthController';
import { check } from 'express-validator';

const authRouter = Router();

authRouter.get('/register', AuthController.register);
authRouter.get('/login', AuthController.login);
authRouter.post(
	'/register',
	[
		check('name')
			.notEmpty()
			.withMessage('The name is mandatory.')
			.isAlpha()
			.withMessage('The name must contain only letters.'),
		check('email')
			.notEmpty()
			.withMessage('The email is mandatory.')
			.isEmail()
			.withMessage('The email address must be valid.'),
		check('password')
			.notEmpty()
			.withMessage('The password is mandatory.')
			.isLength({ min: 8, max: 20 })
			.withMessage('The password must be 8 to 20 characters long.')
			.isAlphanumeric()
			.withMessage('The password can only contain letters and numbers.'),
		check('password_confirmation')
			.notEmpty()
			.withMessage('The password confirmation is mandatory.')
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
	AuthController.store
);

export default authRouter;
