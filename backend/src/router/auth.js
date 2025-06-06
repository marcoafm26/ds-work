import { Router } from 'express';
import { AuthController } from '../controller/AuthController';
import { ClientController } from '../controller/ClientController';

const authRouter = Router();
const authController = new AuthController();
const clientController = new ClientController();

authRouter.post('/login', authController.login);
authRouter.post('/register', clientController.create);

export { authRouter };
