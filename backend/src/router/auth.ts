import { Router } from 'express';
import { AuthController } from '../controller/AuthController';
import { ClientController } from '../controller/ClientController';
import cookieJwtAuth from '../middleware/cookieJwtAuth';

const authRouter = Router();
const authController = new AuthController();
const clientController = new ClientController();

authRouter.post('/login', (req, res) => authController.login(req, res) as any);

authRouter.post(
    '/register',
    (req, res) => clientController.create(req, res) as any
);

authRouter.get('/verify', cookieJwtAuth, (req, res) => {
    res.json({
        success: true,
        message: 'Token válido',
        data: req.body
    });
});

authRouter.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true
    });
    res.json({
        success: true,
        message: 'Logout realizado com sucesso'
    });
});

export { authRouter };
