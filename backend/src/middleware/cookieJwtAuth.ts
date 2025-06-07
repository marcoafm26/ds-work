import { verifyToken } from '../utils/jwt';

const cookieJwtAuth = (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.token;
        const decodedToken = verifyToken(token);
        req.client = decodedToken; // ✅ Armazena em req.user em vez de req.body
        next();
    } catch (err) {
        return res
            .status(401)
            .clearCookie('token', {
                httpOnly: false
            })
            .json({
                success: false,
                errors: ['Token inválido!']
            });
    }
};

export default cookieJwtAuth;
