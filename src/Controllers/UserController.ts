import nodemailer from 'nodemailer';
import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import moment from "moment"
import dotenv from "dotenv"
dotenv.config();
// import cron from "node-cron"
import jwt from 'jsonwebtoken'; const prisma = new PrismaClient();
const pass = process.env.PASSGMAIL
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,

    secure: false,//Usar "false" para ambiente de desenvolvimento
    auth: {
        user: "noreplyredeflex@gmail.com",
        pass: pass,
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

            const emailBody = `
                <p>Olá,${use_name}</p>
                <p>Seu registro foi efetuado com sucesso!</p>

            `;

            const mailOptions = {
                from: "noreplyredeflex@gmail.com",
                to: [use_email],
                subject: "Registro efetuado com sucesso!",
                html: emailBody,
            };

            // Enviar o email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Erro ao enviar o email." });
                } else {
                    return res.status(200).json({

                        message: "Email enviado com sucesso! ",
                    });
                }
            });
            return res.status(200).json({ message: 'Seus dados foram cadastrados com sucesso!' })

        } catch (error) {
            return res.status(400).json({ message: `Não foi possível registrar seus dados! ${error}` })
        }

    }
    public async login(req: Request, res: Response) {
        try {

            const { use_email, use_password }: { use_email: string, use_password: string } = req.body
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailRegex.test(use_email)) {
                return res.status(400).json({ message: "O email não é válido." });
            }
            const existingEmail = await prisma.users.findFirst(
                {
                    select: { use_uuid: true, use_email: true, use_password: true, use_name: true, },
                    where: { use_email: use_email }
                }

            )

            const result = existingEmail?.use_password
            if (!existingEmail) {
                return res.status(404).json({ message: "Este email não existe em nosso banco de dados!" })
            }

            const checkPassword: boolean = result ? bcrypt.compareSync(use_password, result) : false;
            if (!checkPassword) {
                return res.status(404).json({ message: "Senha inválida" });
            }

            const secret = process.env.SECRET;

            if (secret === undefined) {
                return res.status(400).json({ message: "A variável de ambiente SECRET não está definida." });
            }

            const token: string = jwt.sign(
                { id: existingEmail.use_uuid },
                secret,

            );

            return res.status(200).json({ message: "Login efetuado com sucesso!", acesso: token, use_id: existingEmail.use_uuid, use_name: existingEmail.use_name });
        } catch (error) {
            return res.status(400).json({ message: `Não foi possível logar no aplicativo!${error}` })

        }
    }
    //Inicia o processo de recuperação de senha enviando um email com um link de token único para o usuário. 
    //Também atualiza o registro do usuário com o token gerado.
    public async sendEmail(req: Request, res: Response) {
        try {
            const { use_email }: { use_email: string } = req.body;
            const search = await prisma.users.findFirst({ select: { use_uuid: true }, where: { use_email } });
            if (!search) {
                return res.status(400).json({ message: "Esse email não existe!" });
            }
            const codigo: string = Math.floor(1000 + Math.random() * 9000).toString();

            const dataDeExpiracao: Date = new Date();
            dataDeExpiracao.setMinutes(dataDeExpiracao.getMinutes() + 15);

            await prisma.users.update({
                where: { use_uuid: search.use_uuid },
                data: { use_token: codigo, use_date_expire: dataDeExpiracao }


            })
            const mailOptions = {
                from: "noreplyredeflex@gmail.com",
                to: use_email,
                subject: "Recuperação de Senha",
                html: `
                <p>Seu código de recuperação de senha é: <strong>${codigo}</strong></p></p>
                
              `,
            };

            // Enviar o email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Erro ao enviar o email." });
                } else {
                    return res.status(200).json({

                        message: "Código enviado para o email inserido!",
                    });
                }
            });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Erro ao criar ou atualizar o token." });
        }
    }
}

export default new UserController()