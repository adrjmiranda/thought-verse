import Router from 'express';
import AuthController from '../controllers/AuthController';

const authRouter = Router();

authRouter.get('/register', AuthController.register);
authRouter.get('/login', AuthController.login);

export default authRouter;
