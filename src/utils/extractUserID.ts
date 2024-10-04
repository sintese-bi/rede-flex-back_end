
import jwt from 'jsonwebtoken';
export default function extractUserIdFromToken(use_token: string, secret: string) {
    interface TokenPayload {
        id: string;
    }
    try {

        if (!use_token || typeof use_token !== 'string') {
            console.log(`Token não fornecido ou inválido. `)
            return undefined;
        }
        const decodedToken = jwt.verify(use_token, secret) as TokenPayload
        const { id } = decodedToken;

        return id

    } catch (error) {
        console.log(`Erro: ${error}`)
        return undefined;
    }



}