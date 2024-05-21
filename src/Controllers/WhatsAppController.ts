import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class WhatsAppController {
    public async wppInfo(req: Request, res: Response) {
        try {







        } catch (error) {

            return res.status(500).json({ message: `Não foi possível registrar seus dados! ${error}` })


        }

    }


}

export default new WhatsAppController()