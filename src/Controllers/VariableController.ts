import nodemailer from 'nodemailer';
import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import axios from 'axios';
import moment from 'moment-timezone';
// import cron from "node-cron"
import jwt from 'jsonwebtoken';
import { DatasetController } from 'chart.js';
const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,

    secure: true,//Usar "false" para ambiente de desenvolvimento
    auth: {
        user: "",
        pass: process.env.PASSGMAIL,
    },
    tls: {
        rejectUnauthorized: true, //Usar "false" para ambiente de desenvolvimento
    },
});
type AdjustName = {
    name: string | null;
    gas_id: string;
    gas_whats_app?: string[];
    variables: { marginGC: number | null }
};

class VariablesController {

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

    //API que retorna os nomes, ids e telefones para serem mostrados na área de alertas para postos
    public async nameTable(req: Request, res: Response) {

        try {

            const { use_uuid }: { use_uuid: string } = req.body
            const { filter } = req.params
            if (filter === "station") {
                const result = await prisma.ibm_info.findMany({
                    select: {
                        nomefantasia: true,
                        id: true

                    }
                })
                const adjustnames: AdjustName[] = result.map(element => {
                    return { name: element.nomefantasia, gas_id: element.id, variables: { marginGC: 0 } }
                })
                const gas_stations = await prisma.gas_station_setvariables.findMany({
                    select: { gas_station_whats_app: true, ibm_info_id: true, gas_station_marginGC: true },
                    where: { use_uuid: use_uuid }
                })
                //Ajustando quantidade de números no telefone que retorna
                const gas_stations_nine = gas_stations.map(element => {

                    const change = element.gas_station_whats_app.map(numbers => {
                        let modified0 = numbers.slice(0, 5).concat("9", numbers.slice(5))
                        let modified = modified0.slice(3)
                        return modified
                    })
                    return { gas_station_whats_app: change, ibm_info_id: element.ibm_info_id, gas_marginGC: element.gas_station_marginGC }
                })

                gas_stations_nine.forEach(id => {

                    adjustnames.forEach(element => {
                        if (id.ibm_info_id === element.gas_id) {
                            element.gas_whats_app = id.gas_station_whats_app;
                            element.variables.marginGC = id.gas_marginGC

                        }

                    })

                })

                return res.status(200).json({ data: adjustnames })
            } else if (filter === "region") {

                const result = await prisma.regions.findMany({ select: { regions_uuid: true, regions_name: true, regions_types: true } })
                const adjustnames: AdjustName[] = result.map(element => {
                    return { name: element.regions_name, gas_id: element.regions_uuid, variables: { marginGC: 0 } }
                })
                const gas_stations = await prisma.region_setvariables.findMany({
                    select: { region_whats_app: true, regions_uuid: true, region_marginGC: true },
                    where: { use_uuid: use_uuid }
                })
                const gas_stations_nine = gas_stations.map(element => {

                    const change = element.region_whats_app.map(numbers => {
                        let modified0 = numbers.slice(0, 5).concat("9", numbers.slice(5))
                        let modified = modified0.slice(3)
                        return modified
                    })
                    return { region_whats_app: change, regions_uuid: element.regions_uuid, gas_marginGC: element.region_marginGC }
                })
                gas_stations_nine.forEach(id => {

                    adjustnames.forEach(element => {
                        if (id.regions_uuid === element.gas_id) {
                            element.gas_whats_app = id.region_whats_app;
                            element.variables.marginGC = id.gas_marginGC
                        }

                    })

                })

                return res.status(200).json({ data: adjustnames })
            }



        } catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }

    public async alertsLog(req: Request, res: Response) {
        try {
            const { use_uuid }: { use_uuid: string } = req.body


            const result = await prisma.gas_station_setvariables.findMany({
                select: {

                    ibm_info: {
                        select: {
                            nomefantasia: true,
                        },
                    },
                    gas_station_sanado_hour_ETANOL_HIDRATADO_COMBUSTIVEL: true,
                    gas_station_sanado_hour_marginGC: true,
                    gas_station_sanado_marginGC: true,
                    gas_station_sanado_margin_ETANOL_HIDRATADO_COMBUSTIVEL: true,
                }, where: { use_uuid: use_uuid }
            })
            //Tratamento de logs por posto
            const resultMod = result.map(element => {
                const { ibm_info, ...values } = element;
                const station_name = element.ibm_info?.nomefantasia
                const conditionMarginGC = element.gas_station_sanado_marginGC == true ? "sanado" : "não sanado"
                const conditionMarginETANOL_HIDRATADO_COMBUSTIVEL = element.gas_station_sanado_margin_ETANOL_HIDRATADO_COMBUSTIVEL == true ? "sanado" : "não sanado"

                return [{ date: element.gas_station_sanado_hour_marginGC?.toISOString().split('T')[1].split('.')[0], variable_name: "Gasolina Comum", condition: conditionMarginGC, station_name: station_name },
                { date: element.gas_station_sanado_hour_marginGC?.toISOString().split('T')[1].split('.')[0], variable_name: "Etanol Hidratado Combustível", condition: conditionMarginETANOL_HIDRATADO_COMBUSTIVEL, station_name: station_name }
                ]
            });

            const lastResult = resultMod.flatMap(element => element)

            const sanadoList = lastResult.filter(element => element.condition === "sanado")

            const naoSanadoList = lastResult.filter(element => element.condition === "não sanado")



            return res.status(200).json({ data: { sanados: sanadoList, quant_sanados: sanadoList.length, nãoSanados: naoSanadoList } })


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
    public async updateInfo(req: Request, res: Response) {
        try {
            //Corpo da requisição onde value_type é absoluto=0 e percentual=1
            const { use_uuid, ibm_id, variable_value, variable_name, value_type, telephones }:
                { use_uuid: string, ibm_id: string, variable_value: number, variable_name: string, value_type: boolean, telephones: string[] } = req.body
            //value_type falso para absolute e true para percentual

            const { filter } = req.params
            for (let element of telephones) {
                if (element.length < 11) {
                    return res.status(400).json({ message: "Número de telefone inválido. Deve ter 11 dígitos!" });
                }
            }
            const telephonesFormated = telephones.map(element => {
                const indexToRemove = 2
                const str = element.slice(0, indexToRemove) + element.slice(indexToRemove + 1)
                const newStr = `+55${str}`
                return newStr
            })
            if (filter === "station") {

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



                                data: { gas_station_marginGC: variable_value, gas_station_type_marginGC: value_type, gas_station_whats_app: telephonesFormated },
                                where: { gas_station_uuid: result.gas_station_uuid }
                            })
                            break
                        case "marginAL":
                            await prisma.gas_station_setvariables.update({



                                data: { gas_station_marginAL: variable_value, gas_station_type_marginAL: value_type, gas_station_whats_app: telephonesFormated },
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

                                data: { gas_station_marginGC: variable_value, gas_station_type_marginGC: value_type, gas_station_whats_app: telephonesFormated, use_uuid: use_uuid, ibm_info_id: ibm_id },

                            })
                            break
                        case "marginAL":
                            await prisma.gas_station_setvariables.create({

                                data: { gas_station_marginAL: variable_value, gas_station_type_marginAL: value_type, gas_station_whats_app: telephonesFormated, use_uuid: use_uuid, ibm_info_id: ibm_id },

                            })
                            break

                    }


                }

                return res.status(200).json({ message: "Dados atualizados com sucesso!" })
            } else if (filter === "region") {

                const validVariableNames = ["marginGC", "marginAL", "marginTotal", "volumeGC", "volumeAL", "volumeTotal"];
                if (!validVariableNames.includes(variable_name)) {
                    return res.status(400).json({ message: "Nome de variável inválido" });
                }

                //Buscando se aquele posto para aquele usuário já foi criado no Banco de Dados
                const result = await prisma.region_setvariables.findFirst({
                    select: { region_uuid: true },
                    where: { use_uuid: use_uuid, regions_uuid: ibm_id }

                })
                const telephonesFormated = telephones.map(element => {
                    const indexToRemove = 2
                    const str = element.slice(0, indexToRemove) + element.slice(indexToRemove + 1)
                    const newStr = `+55${str}`
                    return newStr
                })
                //Se ele existir é atualizada a linha respectiva com a variável nova
                if (result) {
                    switch (variable_name) {
                        case "marginGC":
                            await prisma.region_setvariables.update({

                                data: { region_marginGC: variable_value, region_type_marginGC: value_type, region_whats_app: telephonesFormated },
                                where: { region_uuid: result.region_uuid }
                            })
                            break
                        case "marginAL":
                            await prisma.region_setvariables.update({

                                data: { region_marginAL: variable_value, region_type_marginAL: value_type, region_whats_app: telephonesFormated },
                                where: { region_uuid: result.region_uuid }
                            })
                            break

                    }
                }
                //Se não existir é criado
                else if (!result) {
                    switch (variable_name) {
                        case "marginGC":
                            await prisma.region_setvariables.create({

                                data: { region_marginGC: variable_value, region_type_marginGC: value_type, region_whats_app: telephonesFormated, use_uuid: use_uuid, regions_uuid: ibm_id },

                            })
                            break
                        case "marginAL":
                            await prisma.region_setvariables.create({

                                data: { region_marginAL: variable_value, region_type_marginAL: value_type, region_whats_app: telephonesFormated, use_uuid: use_uuid, regions_uuid: ibm_id },

                            })
                            break

                    }


                }

                return res.status(200).json({ message: "Dados atualizados com sucesso!" })
            }


        }

        catch (error) {
            return res.status(500).json({ message: `Erro: ${error}` })
        }

    }


}

export default new VariablesController()