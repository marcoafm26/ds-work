import { Router } from 'express';
import { AccountController } from '../controller/AccountController';

const accountController = new AccountController();
const accountRouter = Router();

accountRouter.post(
    '/account',
    (req, res) => accountController.create(req, res) as any
);

accountRouter.get(
    '/accounts/:clientId',
    (req, res) => accountController.findAll(req, res) as any
);

export { accountRouter };
