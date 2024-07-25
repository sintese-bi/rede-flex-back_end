import nodemailer from 'nodemailer';
import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import axios from 'axios';
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

interface Variables {
    use_uuid: string,
    use_name?: string;
    use_whats_app?: string[];
    use_margin_gc?: boolean;
    use_margin_al?: boolean;
    use_margin_total?: boolean;
    use_volume_gc?: boolean;
    use_volume_al?: boolean;
    use_volume_total?: boolean;
    use_margin_gc_min?: number;
    use_margin_al_min?: number;
    use_margin_total_min?: number;
    use_volume_gc_min?: number;
    use_volume_al_min?: number;
    use_volume_total_min?: number;
    use_margin_gc_flag: string;
    use_margin_al_flag: string;
    use_margin_total_flag: string;
    use_volume_gc_flag: string;
    use_volume_al_flag: string;
    use_volume_total_flag: string;

}

class VariablesController {
    public async setVariables(req: Request, res: Response) {
        try {
            const {
                use_uuid,
                use_whats_app,
                use_margin_gc,
                use_margin_al,
                use_margin_total,
                use_volume_gc,
                use_volume_al,
                use_volume_total,
                use_margin_gc_min,
                use_margin_al_min,
                use_margin_total_min,
                use_volume_gc_min,
                use_volume_al_min,
                use_volume_total_min,
                use_margin_gc_flag,
                use_margin_al_flag,
                use_margin_total_flag,
                use_volume_gc_flag,
                use_volume_al_flag,
                use_volume_total_flag,
            }: Variables = req.body;

            await prisma.users.updateMany({
                data: {
                    use_whats_app: use_whats_app,
                    use_margin_gc: use_margin_gc,
                    use_margin_al: use_margin_al,
                    use_margin_total: use_margin_total,
                    use_volume_gc: use_volume_gc,
                    use_volume_al: use_volume_al,
                    use_volume_total: use_volume_total,
                    use_margin_gc_min: use_margin_gc_min,
                    use_margin_al_min: use_margin_al_min,
                    use_margin_total_min: use_margin_total_min,
                    use_volume_gc_min: use_volume_gc_min,
                    use_volume_al_min: use_volume_al_min,
                    use_volume_total_min: use_volume_total_min,
                    use_margin_gc_flag: use_margin_gc_flag,
                    use_margin_al_flag: use_margin_al_flag,
                    use_margin_total_flag: use_margin_total_flag,
                    use_volume_gc_flag: use_volume_gc_flag,
                    use_volume_al_flag: use_volume_al_flag,
                    use_volume_total_flag: use_volume_total_flag
                },
                where: { use_uuid: use_uuid }
            })
            return res.status(200).json({ message: "Os dados foram atualizados com sucesso!" })


        } catch (error) {

            return res.status(500).json({ message: `Não foi possível registrar seus dados! ${error}` })

        }
    }
    public async dataBaseAll(req: Request, res: Response) {
        try {

            const result = await prisma.basedados.findMany({
                select: {

                    company_emp: true,
                    company_name: true,
                    company_date: true,
                    company_week_day: true,
                    company_fuel: true,
                    company_volume: true,
                    company_cost: true,
                    company_sale: true,
                    company_profit: true,

                },
            });

            return res.status(200).json({ data: result })


        } catch (error) {


            return res.status(500).json({ message: `Não foi possível retornar seus dados! ${error}` })
        }
    }


    public async dataBaseCompany(req: Request, res: Response) {
        try {
            const { company_name, company_emp } = req.body;
            const result = await prisma.basedados.findFirst({
                select: {

                    company_emp: true,
                    company_name: true,
                    company_date: true,
                    company_week_day: true,
                    company_fuel: true,
                    company_volume: true,
                    company_cost: true,
                    company_sale: true,
                    company_profit: true,

                },
                where: { company_emp: company_emp, company_name: company_name }
            });

            return res.status(200).json({ message: result })


        } catch (error) {


            return res.status(500).json({ message: `Não foi possível retornar seus dados! ${error}` })
        }
    }

    // public async consulting(req: Request, res: Response) {
    //     try {
    //         const { use_uuid }: { use_uuid: string } = req.body
    //         const clientToken = req.headers.authorization;
    //         if (!clientToken) {
    //             return res.status(401).json({ message: "Token não fornecido." });
    //         }

    //         const expectedToken = process.env.TOKEN;
    //         if (clientToken == `Bearer ${expectedToken}`) {

    //             const resultSet = await prisma.set_variables.findFirst({
    //                 select: { set_regular_gasoline: true, set_alcohol: true },

    //                 where: { use_uuid: use_uuid }
    //             })


    //             const resultFuel = await prisma.fuel.findFirst({

    //                 select: { fuel_alcohol: true, fuel_regular_gasoline: true },

    //                 where: { use_uuid: use_uuid }
    //             })

    //             const resultSet_1 = resultSet?.set_alcohol ?? 0
    //             const resultSet_2 = resultSet?.set_regular_gasoline ?? 0
    //             const resultFuel_1 = resultFuel?.fuel_alcohol ?? 0
    //             const resultFuel_2 = resultFuel?.fuel_regular_gasoline ?? 0

    //             return res.status(200).json({ data: [{ set_value_alcohol: resultSet_1, set_value_gasoline: resultSet_2, fuel_value_alcohol: resultFuel_1, fuel_value_gasoline: resultFuel_2 }] })

    //         } else {
    //             return res
    //                 .status(401)
    //                 .json({ message: "Falha na autenticação: Token inválido." });
    //         }


    //     } catch (error) {


    //         return res.status(500).json({ message: `Não foi possível retornar seus dados! ${error}` })

    //     }


    // }


    public async variableName(req: Request, res: Response) {
        try {
            const token = process.env.TOKENMONGO;

            const result = await axios.get(
                "http://159.65.42.225:3052/v1/infodata",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.status(200).json(result.data);

        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` });

        }

    }
    public async SumFuelProduct(req: Request, res: Response) {
        try {
            const token = process.env.TOKENMONGO;

            const result = await axios.get(
                "http://159.65.42.225:3052/v1/sum-fuel-literage",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.status(200).json(result.data);

        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` });

        }

    }
    public async dataFrameGallonage(req: Request, res: Response) {
        try {
            const token = process.env.TOKENMONGO;

            const result = await axios.get(
                "http://159.65.42.225:3052/v1/dataframe-gallonage",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.status(200).json(result.data);

        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` });

        }

    }
    public async dataFrameFuel(req: Request, res: Response) {
        try { 

 const token = process.env.TOKENMONGO;

            const result = await axios.get(
                "http://159.65.42.225:3052/v1/dataframe-fuel",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.status(200).json(result.data);

        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }


    }


}

export default new VariablesController()