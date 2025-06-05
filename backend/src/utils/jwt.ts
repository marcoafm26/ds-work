import jwt from 'jsonwebtoken';

export const generateToken = <T>(client: any): string => {
    return jwt.sign(client, process.env.JWT_SECRET!, {
        expiresIn: '2h'
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};
