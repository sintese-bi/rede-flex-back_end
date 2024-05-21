import nodemailer from 'nodemailer';
import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import moment from "moment"
// import cron from "node-cron"
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,

    secure: false,//Usar "false" para ambiente de desenvolvimento
    auth: {
        user: "",
        pass: process.env.PASSGMAIL,
    },
    tls: {
        rejectUnauthorized: false, //Usar "false" para ambiente de desenvolvimento
    },
});

interface User {
    use_name?: string;
    use_whats_app?: string;
    use_margem_gc?: boolean;
    use_margem_al?: boolean;
    use_margem_total?: boolean;
    use_volume_gc?: boolean;
    use_volume_al?: boolean;
    use_volume_total?: boolean;
    use_margem_gc_min?: number;
    use_margem_al_min?: number;
    use_margem_total_min?: number;
    use_volume_gc_min?: number;
    use_volume_al_min?: number;
    use_volume_total_min?: number;
}

class UserController {
    public async setVariables(req: Request, res: Response) {
        try {
            const {
                use_name,
                use_whats_app,
                use_margem_gc,
                use_margem_al,
                use_margem_total,
                use_volume_gc,
                use_volume_al,
                use_volume_total,
                use_margem_gc_min,
                use_margem_al_min,
                use_margem_total_min,
                use_volume_gc_min,
                use_volume_al_min,
                use_volume_total_min,
            }: User = req.body;

            await prisma.users.updateMany({
                data: {
                    use_whats_app: use_whats_app,
                    use_margem_gc: use_margem_gc,
                    use_margem_al: use_margem_al,
                    use_margem_total: use_margem_total,
                    use_volume_gc: use_volume_gc,
                    use_volume_al: use_volume_al,
                    use_volume_total: use_volume_total,
                    use_margem_gc_min: use_margem_gc_min,
                    use_margem_al_min: use_margem_al_min,
                    use_margem_total_min: use_margem_total_min,
                    use_volume_gc_min: use_volume_gc_min,
                    use_volume_al_min: use_volume_al_min,
                    use_volume_total_min: use_volume_total_min,
                },
                where: { use_name: use_name }
            })
            return res.status(200).json({ message: "Os dados foram atualizados com sucesso!" })


        } catch (error) {

            return res.status(500).json({ message: `Não foi possível registrar seus dados! ${error}` })

        }
    }


}

export default new UserController()