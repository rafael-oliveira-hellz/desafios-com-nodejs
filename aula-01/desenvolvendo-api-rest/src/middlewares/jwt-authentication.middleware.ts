import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../models/errors/forbidden.error.model";
import userRepository from "../repositories/user.repository";
import JWT from "jsonwebtoken";

async function jwtAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais inválidas!');
        }

        const [ authenticationType, token ] = authorizationHeader.split(' ');

        if (authenticationType !== 'Bearer' || !token) {
            throw new ForbiddenError('Tipo de autenticação inválido');
        }

        try {
            const tokenPaylod = JWT.verify(token, 'my_secret_key');

            if (typeof tokenPaylod !== 'object' || !tokenPaylod.sub) {
                throw new ForbiddenError('Token inválido');
            }

            const user = { uuid: tokenPaylod.sub, username: tokenPaylod.username };

            req.user = user;

            next();
        } catch (error) {
            throw new ForbiddenError('Token inválido');
        }
    } catch (error) {
        next(error);
    }
}

export default jwtAuthenticationMiddleware;