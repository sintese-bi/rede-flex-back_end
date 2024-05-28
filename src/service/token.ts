import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acesso negado!' });

    try {
        
        const secret = process.env.SECRET as string;
        if (!secret) throw new Error('A variável de ambiente SECRET não está definida.');

        jwt.verify(token, secret);

        next();
    } catch (err) {
        res.status(401).json({ message: 'O Token é inválido!' });
    }
};

export default checkToken;
