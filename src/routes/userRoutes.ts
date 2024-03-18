import Router from 'express';
import { ensureAuthenticated } from '../middlewares/authenticationMiddleware';
import UserController from '../controllers/UserController';

const userRouter = Router();

userRouter.get('/dashboard', ensureAuthenticated, UserController.dashboard);
userRouter.get('/profile', ensureAuthenticated, UserController.profile);
userRouter.get(
	'/edit-profile',
	ensureAuthenticated,
	UserController.editProfile
);

export default userRouter;
