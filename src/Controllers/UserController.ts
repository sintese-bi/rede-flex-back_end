import nodemailer from 'nodemailer';
import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import moment from "moment"
// import cron from "node-cron"
import jwt from 'jsonwebtoken'; const prisma = new PrismaClient();
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
interface Users {
    use_email: string;
    use_name: string
    use_password: string
    use_confirm_password: string
}
interface Recover {
    use_email: string;
    use_password: string;
    use_confirm_password: string;
    use_token: string;

}
class UserController {
    public async registerUsers(req: Request, res: Response) {
        try {

            const { use_email, use_name, use_password, use_confirm_password }: Users = req.body;

            const result = await prisma.users.findFirst({
                where: { use_email: use_email }
            })

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

            if (!emailRegex.test(use_email)) {
                return res.status(400).json({ message: "O email não é válido!" });
            }
            if (result) {
                return res.status(400).json({ message: "O email já está em uso!" })

            }

            if (use_password.length < 4) {
                return res
                    .status(400)
                    .json({ message: "A senha precisa ter 4 ou mais caracteres!" });
            }
            if (use_password != use_confirm_password) {
                return res.status(400).json({ message: "A senha e a confirmação precisam ser iguais!" })
            }
            const saltRounds = 10;
            const passwordHash: string = bcrypt.hashSync(use_password, saltRounds);


            await prisma.users.create({
                data: {
                    use_email: use_email,
                    use_password: passwordHash,
                    use_name: use_name

                }
            })

            //Um fluxo que envia um email para o usuário cadastrado confirmando o sucesso do registro

            // const emailBody = `
            //     <p>Olá,${use_name}</p>
            //     <p>Agradecemos por se cadastrar em nosso Gerenciador de Tarefas!</p>

            // `;

            // const mailOptions = {
            //     from: "",
            //     to: [use_email],
            //     subject: "Registro efetuado com sucesso!",
            //     html: emailBody,
            // };

            // // Enviar o email
            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.error(error);
            //         return res.status(500).json({ message: "Erro ao enviar o email." });
            //     } else {
            //         return res.status(200).json({

            //             message: "Email enviado com sucesso! ",
            //         });
            //     }
            // });
            return res.status(200).json({ message: 'Seus dados foram cadastrados com sucesso!' })

        } catch (error) {

            return res.status(400).json({ message: `Não foi possível registrar seus dados! ${error}` })


        }

    }


}

export default new UserController()