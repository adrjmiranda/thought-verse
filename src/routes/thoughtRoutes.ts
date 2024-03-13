import Router from 'express';
import ThoughtController from '../controllers/ThoughtController';

const thoughtRouter = Router();

thoughtRouter.get('', ThoughtController.index);
// thoughtRouter.get('/create', ThoughtController.create);

export default thoughtRouter;
