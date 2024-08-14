import nodemailer from 'nodemailer';
import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import axios from 'axios';
import moment from 'moment-timezone';
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


class VariablesController {

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

    public async mapPosition(req: Request, res: Response) {
        try {
            const token = process.env.TOKENMONGO;

            const info = await axios.get(
                "http://159.65.42.225:3052/v1/map-data",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await prisma.ibm_info.findMany({
                select: {
                    lat: true, long: true, nomefantasia: true, ibm: true, endereco: true
                }
            })

            info.data.data.forEach((element: any) => {

                result.forEach(values => {
                    if (element.ibm === values.ibm) {

                        Object.assign(values, { ...element });
                    }

                })

            })

            return res.status(200).json({ data: result })


        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }
    public async nameFuelStationMock(req: Request, res: Response) {

        try {

            const result = await prisma.ibm_info.findMany({
                select: {
                    nomefantasia: true
                }
            })
            const adjustnames = result.map(element => {

                return { name: element.nomefantasia }



            })
            return res.status(200).json({ data: adjustnames })


        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }
    public async alertsMock(req: Request, res: Response) {
        try {
            const date = moment.tz('America/Sao_Paulo').format('DD-MM-YYYY')
            const alerts = [{ date: date, variable_name: "marginGC", condition: "sanado" },
            { date: date, variable_name: "marginAL", condition: "não sanado" },
            { date: date, variable_name: "marginTotal", condition: "não sanado" },
            { date: date, variable_name: "volumeGC", condition: "sanado" },
            { date: date, variable_name: "volumeAL", condition: "não sanado" },
            { date: date, variable_name: "volumeTotal", condition: "sanado" }]

            return res.status(200).json({ data: alerts })


        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }
    public async CEP(req: Request, res: Response) {
        try {

            const number = await prisma.ibm_info.findMany({
                select: { cep: true, id: true }
            })


            number.forEach(async (element) => {

                const value = await axios.get(`http://viacep.com.br/ws/${element.cep}/json/`)

                await prisma.ibm_info.update({
                    data: { endereco: `${value.data.localidade}-${value.data.bairro}-${value.data.logradouro}` }
                    , where: { id: element.id }
                })

            })
            return res.status(200).json({ data: "Dados inseridos!" })


        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }
    //API para atualizar as variaveis de um posto 
    public async updateGasStationAlertsInfo(req: Request, res: Response) {
        try {
            //Corpo da requisição onde value_type é absoluto=0 e percentual=1
            const { use_uuid, ibm_id, variable_value, variable_name, value_type, telephones }:
                { use_uuid: string, ibm_id: string, variable_value: number, variable_name: string, value_type: boolean, telephones: string[] } = req.body
            const validVariableNames = ["marginGC", "marginAL", "marginTotal", "volumeGC", "volumeAL", "volumeTotal"];
            if (!validVariableNames.includes(variable_name)) {
                return res.status(400).json({ message: "Nome de variável inválido" });
            }
            //Buscando se aquele posto para aquele usuário já foi criado no Banco de Dados
            const result = await prisma.gas_station_setvariables.findFirst({
                select: { gas_station_uuid: true },
                where: { use_uuid: use_uuid, ibm_info_id: ibm_id }

            })

            //Se ele existir é atualizada a linha respectiva com a variável nova
            if (result) {
                switch (variable_name) {
                    case "marginGC":
                        await prisma.gas_station_setvariables.update({



                            data: { gas_station_marginGC: variable_value, gas_station_type_marginGC: value_type, gas_station_whats_app: telephones },
                            where: { gas_station_uuid: result.gas_station_uuid }
                        })
                        break
                    case "marginAL":
                        await prisma.gas_station_setvariables.update({



                            data: { gas_station_marginAL: variable_value, gas_station_type_marginAL: value_type, gas_station_whats_app: telephones },
                            where: { gas_station_uuid: result.gas_station_uuid }
                        })
                        break
                    case "marginTotal":
                        await prisma.gas_station_setvariables.update({



                            data: { gas_station_marginTotal: variable_value, gas_station_type_marginTotal: value_type, gas_station_whats_app: telephones },
                            where: { gas_station_uuid: result.gas_station_uuid }
                        })
                        break
                    case "volumeGC":
                        await prisma.gas_station_setvariables.update({



                            data: { gas_station_volumeGC: variable_value, gas_station_type_volumeGC: value_type, gas_station_whats_app: telephones },
                            where: { gas_station_uuid: result.gas_station_uuid }
                        })
                        break
                    case "volumeAL":
                        await prisma.gas_station_setvariables.update({



                            data: { gas_station_volumeAL: variable_value, gas_station_type_volumeAL: value_type, gas_station_whats_app: telephones },
                            where: { gas_station_uuid: result.gas_station_uuid }
                        })
                        break
                    case "volumeTotal":
                        await prisma.gas_station_setvariables.update({



                            data: { gas_station_volumeTotal: variable_value, gas_station_type_volumeTotal: value_type, gas_station_whats_app: telephones },
                            where: { gas_station_uuid: result.gas_station_uuid }
                        })
                        break
                }
            }
            //Se não existir é criado
            else if (!result) {
                switch (variable_name) {
                    case "marginGC":
                        await prisma.gas_station_setvariables.create({

                            data: { gas_station_marginGC: variable_value, gas_station_type_marginGC: value_type, gas_station_whats_app: telephones, use_uuid: use_uuid, ibm_info_id: ibm_id },

                        })
                        break
                    case "marginAL":
                        await prisma.gas_station_setvariables.create({

                            data: { gas_station_marginAL: variable_value, gas_station_type_marginAL: value_type, gas_station_whats_app: telephones, use_uuid: use_uuid, ibm_info_id: ibm_id },

                        })
                        break
                    case "marginTotal":
                        await prisma.gas_station_setvariables.create({

                            data: { gas_station_marginTotal: variable_value, gas_station_type_marginTotal: value_type, gas_station_whats_app: telephones, use_uuid: use_uuid, ibm_info_id: ibm_id },

                        })
                        break
                    case "volumeGC":
                        await prisma.gas_station_setvariables.create({

                            data: { gas_station_volumeGC: variable_value, gas_station_type_volumeGC: value_type, gas_station_whats_app: telephones, use_uuid: use_uuid, ibm_info_id: ibm_id },

                        })
                        break
                    case "volumeAL":
                        await prisma.gas_station_setvariables.create({

                            data: { gas_station_volumeAL: variable_value, gas_station_type_volumeAL: value_type, gas_station_whats_app: telephones, use_uuid: use_uuid, ibm_info_id: ibm_id },

                        })
                        break
                    case "volumeTotal":
                        await prisma.gas_station_setvariables.create({

                            data: { gas_station_volumeTotal: variable_value, gas_station_type_volumeTotal: value_type, gas_station_whats_app: telephones, use_uuid: use_uuid, ibm_info_id: ibm_id },

                        })
                        break
                }


            }

            return res.status(200).json({ message: "Dados atualizados com sucesso!" })


        }

        catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }


}

export default new VariablesController()