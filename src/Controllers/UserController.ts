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

    secure: true,//Usar "false" para ambiente de desenvolvimento
    auth: {
        user: "noreplyredeflex@gmail.com",
        pass: pass,
    },
    tls: {
        rejectUnauthorized: true, //Usar "false" para ambiente de desenvolvimento
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
    //Controlador de registro do usuário
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
    //Controlador de login do usuário
    public async login(req: Request, res: Response) {
        try {

            const { use_email, use_password }: { use_email: string, use_password: string } = req.body
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailRegex.test(use_email)) {
                return res.status(400).json({ message: "O email não é válido." });
            }
            const existingEmail = await prisma.users.findFirst(
                {
                    select: { use_uuid: true, use_email: true, use_password: true, use_name: true, use_level:true },
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

            return res.status(200).json({ message: "Login efetuado com sucesso!", acesso: token, use_id: existingEmail.use_uuid, use_name: existingEmail.use_name,use_level:existingEmail.use_level });
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
            const secret = process.env.SECRET;
            if (secret === undefined) {
                return res.status(400).json({ message: "A variável de ambiente SECRET não está definida." });
            }
            const use_token: string = jwt.sign(
                { id: search.use_uuid },
                secret,
                { expiresIn: '1h' }
            );
            const saltRounds = 10;
            const passwordHash: string = bcrypt.hashSync(use_token, saltRounds);
            await prisma.users.update({

                data: { use_token: passwordHash },
                where: { use_uuid: search.use_uuid },
            });


            const mailOptions = {
                from: "noreplyredeflex@gmail.com",
                to: use_email,
                subject: "Recuperação de Senha",
                html: `
                <p>Clique no link abaixo para recuperar sua senha do Dashboard RedeFlex:</p>
                <a href="https://dashboard.redeflex.com.br/passwordRecovery?use_token=${use_token}&use_email=${use_email}">Recuperar Senha</a>
              `,
            };

            // Enviar o email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Erro ao enviar o email." });
                } else {
                    return res.status(200).json({
                        token: use_token,
                        message: "Token enviado para o email inserido!",
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
    //Controlador que cria uma nova senha para o usuário
    public async passwordRecover(req: Request, res: Response) {
        try {
            const { use_email, use_token } = req.query as { use_email?: string, use_token?: string };

            if (!use_email || !use_token) {
                return res.status(400).json({ message: "Parâmetros ausentes na query." });
            }

            const search = await prisma.users.findFirst({ select: { use_uuid: true, use_token: true }, where: { use_email } });
            if (!search) {
                return res.status(400).json({ message: "Esse email não existe!" });
            }
            const result: string = search!.use_token!;
            const checkPassword: boolean = await bcrypt.compareSync(use_token!, result);
            if (!checkPassword) {
                return res.status(401).json({ message: "O Token é inválido!" })
            }
            const { use_password } = req.body;

            const user = await prisma.users.findUnique({
                where: {
                    use_uuid: search.use_uuid,
                    use_token: result
                },
            });

            if (!user) {
                return res.status(400).json({ message: "Token ou email inválido." });
            }

            try {
                const secret = process.env.SECRET;
                if (secret === undefined) {
                    return res.status(400).json({ message: "A variável de ambiente SECRET não está definida." });
                }

                const decoded = jwt.verify(use_token, secret) as jwt.JwtPayload;

                if (typeof decoded === 'string') {
                    return res.status(401).json({ message: "Token inválido." });
                }

                const currentTime = Date.now() / 1000;

                if (decoded.exp && decoded.exp < currentTime) {
                    return res.status(401).json({ message: "Token expirado." });
                }
            } catch (err) {
                return res.status(401).json({ message: "Token inválido." });
            }


            if (use_password.length < 4) {
                return res
                    .status(400)
                    .json({ message: "A senha precisa ter 4 ou mais caracteres!" });
            }

            const saltRounds = 10;

            const passwordHash: string = bcrypt.hashSync(use_password, saltRounds);

            await prisma.users.update({

                data: { use_token: null },
                where: { use_uuid: search.use_uuid },
            });

            await prisma.users.update({
                data: { use_password: passwordHash },

                where: { use_uuid: search.use_uuid }

            }
            );

            return res.status(200).json({
                message: "Senha atualizada com sucesso!",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar nova senha!" });
        }
    }
}

export default new UserController()