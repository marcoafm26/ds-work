import { verifyToken } from '../src/utils/jwt';

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const body = verifyToken(token);
        req.body = body;
        next();
    } catch (err) {
        return res
            .status(401)
            .json({
                success: false,
                errors: ['Usuário não autorizado!']
            })
            .clearCookie('token')
            .redirect('/login');
    }
};

export default cookieJwtAuth;
