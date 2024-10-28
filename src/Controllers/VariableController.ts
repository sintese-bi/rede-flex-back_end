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
import extractUserIdFromToken from '../utils/extractUserID';
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
            const { use_token }: any = req.params;

            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const id_token = extractUserIdFromToken(use_token, secret)
            if (!id_token) {
                return res.status(400).json({ message: "Token de usuário inválido ou não fornecido." });
            }

            const info = await axios.get(
                `http://159.65.42.225:3052/v1/map-data/${use_token}`,
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
    public async saveModalMargins(req: Request, res: Response) {
        try {
            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const { use_token }: any = req.params;
            const id = extractUserIdFromToken(use_token, secret)
            const { use_mlt, use_tmc, use_tmf, use_tmp, use_tmvol, use_lucro_bruto_operacional, use_lucro_bruto_operacional_galonagem, use_lucro_bruto_operacional_produto, use_gasolina_comum, use_etanol_comum, use_oleo_diesel_b_s10_comum, use_oleo_diesel_b_s500_comum }: {
                use_mlt: number, use_tmc: number, use_tmf: number, use_tmp: number, use_tmvol: number,
                use_lucro_bruto_operacional: number, use_gasolina_comum: number, use_etanol_comum: number, use_oleo_diesel_b_s10_comum: number,
                use_oleo_diesel_b_s500_comum: number
                use_lucro_bruto_operacional_galonagem: number
                use_lucro_bruto_operacional_produto: number
            } = req.body
            await prisma.users.update({
                data: {
                    use_mlt: use_mlt, use_tmc: use_tmc, use_tmf: use_tmf, use_tmvol: use_tmvol,
                    use_tmp: use_tmp, use_lucro_bruto_operacional: Math.round((use_lucro_bruto_operacional / 100) * 100) / 100,
                    use_GASOLINA_COMUM_comb: use_gasolina_comum, use_ETANOL_COMUM_comb: use_etanol_comum, use_OLEO_DIESEL_B_S10_COMUM_comb: use_oleo_diesel_b_s10_comum,
                    use_OLEO_DIESEL_B_S500_COMUM_comb: use_oleo_diesel_b_s500_comum,
                    use_lucro_bruto_operacional_galonagem: Math.round((use_lucro_bruto_operacional_galonagem / 100) * 100) / 100,
                    use_lucro_bruto_operacional_produto: Math.round((use_lucro_bruto_operacional_produto / 100) * 100) / 100
                }, where: { use_uuid: id }
            })
            return res.status(200).json({ message: "Dados atualizados com sucesso!" })


        } catch (error) {
            return res.status(500).json({ message: `Não foi possível atualizar seus dados!: ${error}` })
        }
    }
    public async returnModalMargins(req: Request, res: Response) {

        try {
            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const { use_token }: any = req.params;

            const id = extractUserIdFromToken(use_token, secret)
            const result = await prisma.users.findUnique({
                select: {
                    use_tmc: true, use_tmf: true,
                    use_mlt: true, use_tmp: true, use_tmvol: true, use_lucro_bruto_operacional: true, use_OLEO_DIESEL_B_S10_COMUM_comb: true,
                    use_ETANOL_COMUM_comb: true, use_GASOLINA_COMUM_comb: true, use_OLEO_DIESEL_B_S500_COMUM_comb: true,
                    use_lucro_bruto_operacional_galonagem: true, use_lucro_bruto_operacional_produto: true
                }, where: { use_uuid: id }
            })


            const info = {
                use_tmc: result?.use_tmc, use_tmf: result?.use_tmf, use_mlt: result?.use_mlt, use_tmp: result?.use_tmp,
                use_tmvol: result?.use_tmvol, use_lucro_bruto_operacional: Math.round(((result?.use_lucro_bruto_operacional || 0) * 100) * 100) / 100,
                use_lucro_bruto_operacional_produto: Math.round(((result?.use_lucro_bruto_operacional_produto || 0) * 100) * 100) / 100,
                use_lucro_bruto_operacional_galonagem: Math.round(((result?.use_lucro_bruto_operacional_galonagem || 0) * 100) * 100) / 100,
                use_gasolina_comum: result?.use_GASOLINA_COMUM_comb, use_etanol_comum: result?.use_ETANOL_COMUM_comb,
                use_oleo_diesel_b_s10_comum: result?.use_OLEO_DIESEL_B_S10_COMUM_comb,
                use_oleo_diesel_b_s500_comum: result?.use_OLEO_DIESEL_B_S500_COMUM_comb
            }


            return res.status(200).json({ data: info })

        } catch (error) {
            return res.status(500).json({ message: `Não foi possível retornar os dados!: ${error}` })
        }

    }

    public async modalStationsReturn(req: Request, res: Response) {
        try {
            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const { use_token }: any = req.params;

            const id = extractUserIdFromToken(use_token, secret)
            // Obter os dados de result e stations
            const result = await prisma.gas_station_setvariables.findMany({
                select: {
                    gas_station_TMF_modal: true,
                    gas_station_LUCRO_BRUTO_OPERACIONAL_modal: true,
                    gas_station_LUCRO_BRUTO_GALONAGEM_modal: true,
                    gas_station_LUCRO_BRUTO_PRODUTO_modal: true,
                    gas_station_TMC_modal: true,
                    gas_station_TMP_modal: true,
                    gas_station_TMVOL_modal: true,
                    gas_station_MLT_modal: true,
                    gas_station_ETANOL_COMUM_comb: true,
                    gas_station_GASOLINA_COMUM_comb: true,
                    gas_station_OLEO_DIESEL_B_S10_COMUM_comb: true,
                    gas_station_OLEO_DIESEL_B_S500_COMUM_comb: true,
                    ibm_info: {
                        select: {
                            nomefantasia: true,
                            id: true
                        }
                    }
                },
                where: { use_uuid: id }
            });

            const stations = await prisma.ibm_info.findMany({
                select: {
                    nomefantasia: true,
                    id: true
                }
            });
            const finalTM = result.map(element => ({
                nome_fantasia: element.ibm_info?.nomefantasia ?? "",
                id: element.ibm_info?.id ?? 0,
                tmp: element.gas_station_TMP_modal ?? 0,
                tmf: element.gas_station_TMF_modal ?? 0,
                tmc: element.gas_station_TMC_modal ?? 0,
                tmvol: element.gas_station_TMVOL_modal ?? 0,
                mlt: element.gas_station_MLT_modal ?? 0,
                tm_lucro_bruto_operacional: Math.round((element.gas_station_LUCRO_BRUTO_OPERACIONAL_modal ?? 0) * 100 * 100) / 100 ,
                tm_lucro_bruto_operacional_produto: Math.round((element.gas_station_LUCRO_BRUTO_PRODUTO_modal ?? 0) * 100 * 100) / 100,
                tm_lucro_bruto_operacional_galonagem: Math.round((element.gas_station_LUCRO_BRUTO_GALONAGEM_modal ?? 0) * 100 * 100) / 100,
                etanol_comum: element.gas_station_ETANOL_COMUM_comb ?? 0,
                gasolina_comum: element.gas_station_GASOLINA_COMUM_comb ?? 0,
                oleo_diesel_b_s10_comum: element.gas_station_OLEO_DIESEL_B_S10_COMUM_comb ?? 0,
                oleo_diesel_b_s500_comum: element.gas_station_OLEO_DIESEL_B_S500_COMUM_comb ?? 0

            }));

            stations.forEach(station => {

                const existsInResult = finalTM.some(item => item.id === station.id);

                if (!existsInResult) {
                    finalTM.push({
                        nome_fantasia: station.nomefantasia ?? "",
                        id: station.id ?? 0,
                        tmp: 0,
                        tmf: 0,
                        tmc: 0,
                        tmvol: 0,
                        mlt: 0,
                        tm_lucro_bruto_operacional: 0,
                        tm_lucro_bruto_operacional_galonagem: 0,
                        tm_lucro_bruto_operacional_produto: 0,
                        etanol_comum: 0,
                        gasolina_comum: 0,
                        oleo_diesel_b_s10_comum: 0,
                        oleo_diesel_b_s500_comum: 0,
                    });
                }
            });


            return res.status(200).json({ data: finalTM })

        } catch (error) {
            return res.status(500).json({ message: `Não foi possível retornar os dados!: ${error}` })
        }

    }
    public async modalStationsInsert(req: Request, res: Response) {
        try {
            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const { use_token }: any = req.params;
            const id_token = extractUserIdFromToken(use_token, secret)
            const { id, tmp, tmf, tmc, tmvol, tm_lucro_bruto_operacional, tm_lucro_bruto_operacional_galonagem, tm_lucro_bruto_operacional_produto, mlt, etanol_comum, gasolina_comum, oleo_diesel_b_s10_comum, oleo_diesel_b_s500_comum }: {
                id: string, tmp: number, tmf: number, tmc: number,
                tmvol: number, tm_lucro_bruto_operacional: number, tm_lucro_bruto_operacional_galonagem: number,
                tm_lucro_bruto_operacional_produto: number, mlt: number, etanol_comum: number,
                gasolina_comum: number, oleo_diesel_b_s10_comum: number, oleo_diesel_b_s500_comum: number
            } = req.body
            const result = await prisma.gas_station_setvariables.findFirst({ where: { use_uuid: id_token, ibm_info_id: id } })
            if (!result) {
                await prisma.gas_station_setvariables.create({
                    data: {
                        gas_station_TMF_modal: tmf,
                        gas_station_LUCRO_BRUTO_OPERACIONAL_modal: Math.round((tm_lucro_bruto_operacional / 100) * 100) / 100,
                        gas_station_LUCRO_BRUTO_PRODUTO_modal: Math.round((tm_lucro_bruto_operacional_produto / 100) * 100) / 100,
                        gas_station_LUCRO_BRUTO_GALONAGEM_modal: Math.round((tm_lucro_bruto_operacional_galonagem / 100) * 100) / 100,
                        gas_station_TMC_modal: tmc,
                        gas_station_TMP_modal: tmp,
                        gas_station_TMVOL_modal: tmvol,
                        gas_station_MLT_modal: mlt,
                        gas_station_ETANOL_COMUM_comb: etanol_comum,
                        gas_station_GASOLINA_COMUM_comb: gasolina_comum,
                        gas_station_OLEO_DIESEL_B_S10_COMUM_comb: oleo_diesel_b_s10_comum,
                        gas_station_OLEO_DIESEL_B_S500_COMUM_comb: oleo_diesel_b_s500_comum,
                        use_uuid: id_token,
                        ibm_info_id: id
                    }
                })
            } else {
                await prisma.gas_station_setvariables.updateMany({
                    data: {
                        gas_station_TMF_modal: tmf,
                        gas_station_LUCRO_BRUTO_OPERACIONAL_modal: Math.round((tm_lucro_bruto_operacional / 100) * 100) / 100,
                        gas_station_LUCRO_BRUTO_PRODUTO_modal: Math.round((tm_lucro_bruto_operacional_produto / 100) * 100) / 100,
                        gas_station_LUCRO_BRUTO_GALONAGEM_modal: Math.round((tm_lucro_bruto_operacional_galonagem / 100) * 100) / 100,
                        gas_station_TMC_modal: tmc,
                        gas_station_TMP_modal: tmp,
                        gas_station_TMVOL_modal: tmvol,
                        gas_station_MLT_modal: mlt,
                        gas_station_ETANOL_COMUM_comb: etanol_comum,
                        gas_station_GASOLINA_COMUM_comb: gasolina_comum,
                        gas_station_OLEO_DIESEL_B_S10_COMUM_comb: oleo_diesel_b_s10_comum,
                        gas_station_OLEO_DIESEL_B_S500_COMUM_comb: oleo_diesel_b_s500_comum,
                    }, where: { use_uuid: id_token, ibm_info_id: id }
                })
            }

            return res.status(200).json({ message: "Dados atualizados com sucesso!" })


        } catch (error) {
            return res.status(500).json({ message: `Não foi possível atualizar seus dados!: ${error}` })
        }
    }

    public async modalRegionsInsert(req: Request, res: Response) {
        try {
            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const { use_token }: any = req.params;
            const id_token = extractUserIdFromToken(use_token, secret)
            const { id, tmp, tmf, tmc, tmvol, tm_lucro_bruto_operacional, tm_lucro_bruto_operacional_galonagem, tm_lucro_bruto_operacional_produto,
                mlt, etanol_comum, gasolina_comum, oleo_diesel_b_s10_comum, oleo_diesel_b_s500_comum }: {
                    id: string, tmp: number, tmf: number, tmc: number,
                    tmvol: number, tm_lucro_bruto_operacional: number,
                    tm_lucro_bruto_operacional_galonagem: number,
                    tm_lucro_bruto_operacional_produto: number,
                    mlt: number, etanol_comum: number,
                    gasolina_comum: number, oleo_diesel_b_s10_comum: number, oleo_diesel_b_s500_comum: number
                } = req.body
            const result = await prisma.region_setvariables.findFirst({ where: { use_uuid: id_token, regions_uuid: id } })
            if (!result) {
                await prisma.region_setvariables.create({
                    data: {
                        region_station_TMF_modal: tmf,
                        region_station_LUCRO_BRUTO_OPERACIONAL_modal: Math.round((tm_lucro_bruto_operacional / 100) * 100) / 100,
                        region_station_LUCRO_BRUTO_GALONAGEM_modal: Math.round((tm_lucro_bruto_operacional_galonagem / 100) * 100) / 100,
                        region_station_LUCRO_BRUTO_PRODUTO_modal: Math.round((tm_lucro_bruto_operacional_produto / 100) * 100) / 100,
                        region_station_TMC_modal: tmc,
                        region_station_TMP_modal: tmp,
                        region_station_TMVOL_modal: tmvol,
                        region_station_MLT_modal: mlt,
                        region_station_ETANOL_COMUM_comb: etanol_comum,
                        region_station_GASOLINA_COMUM_comb: gasolina_comum,
                        region_station_OLEO_DIESEL_B_S10_COMUM_comb: oleo_diesel_b_s10_comum,
                        region_station_OLEO_DIESEL_B_S500_COMUM_comb: oleo_diesel_b_s500_comum,
                        use_uuid: id_token,
                        regions_uuid: id
                    }
                })
            } else {
                await prisma.region_setvariables.updateMany({
                    data: {
                        region_station_TMF_modal: tmf,
                        region_station_LUCRO_BRUTO_OPERACIONAL_modal: Math.round((tm_lucro_bruto_operacional / 100) * 100) / 100,
                        region_station_LUCRO_BRUTO_GALONAGEM_modal: Math.round((tm_lucro_bruto_operacional_galonagem / 100) * 100) / 100,
                        region_station_LUCRO_BRUTO_PRODUTO_modal: Math.round((tm_lucro_bruto_operacional_produto / 100) * 100) / 100,
                        region_station_TMC_modal: tmc,
                        region_station_TMP_modal: tmp,
                        region_station_TMVOL_modal: tmvol,
                        region_station_MLT_modal: mlt,
                        region_station_ETANOL_COMUM_comb: etanol_comum,
                        region_station_GASOLINA_COMUM_comb: gasolina_comum,
                        region_station_OLEO_DIESEL_B_S10_COMUM_comb: oleo_diesel_b_s10_comum,
                        region_station_OLEO_DIESEL_B_S500_COMUM_comb: oleo_diesel_b_s500_comum,
                    }, where: { use_uuid: id_token, regions_uuid: id }
                })
            }

            return res.status(200).json({ message: "Dados atualizados com sucesso!" })


        } catch (error) {
            return res.status(500).json({ message: `Não foi possível atualizar seus dados!: ${error}` })
        }
    }
    public async modalRegionsReturn(req: Request, res: Response) {
        try {
            const secret = process.env.SECRET;
            if (!secret) {
                throw new Error('Chave secreta não definida. Verifique a variável de ambiente SECRET.');
            }
            const { use_token }: any = req.params;

            const id = extractUserIdFromToken(use_token, secret)
            // Obter os dados de result e stations
            const result = await prisma.region_setvariables.findMany({
                select: {
                    region_station_TMF_modal: true,
                    region_station_LUCRO_BRUTO_OPERACIONAL_modal: true,
                    region_station_LUCRO_BRUTO_GALONAGEM_modal: true,
                    region_station_LUCRO_BRUTO_PRODUTO_modal: true,
                    region_station_TMC_modal: true,
                    region_station_TMP_modal: true,
                    region_station_TMVOL_modal: true,
                    region_station_MLT_modal: true,
                    region_station_ETANOL_COMUM_comb: true,
                    region_station_GASOLINA_COMUM_comb: true,
                    region_station_OLEO_DIESEL_B_S10_COMUM_comb: true,
                    region_station_OLEO_DIESEL_B_S500_COMUM_comb: true,
                    regions: {
                        select: {
                            regions_name: true,
                            regions_uuid: true
                        }
                    }
                },
                where: { use_uuid: id }
            });

            const regions = await prisma.regions.findMany({
                select: {
                    regions_name: true,
                    regions_uuid: true
                }
            });
            const finalTM = result.map(element => ({
                region_name: element.regions?.regions_name ?? "",
                id: element.regions?.regions_uuid ?? 0,
                tmp: element.region_station_TMP_modal ?? 0,
                tmf: element.region_station_TMF_modal ?? 0,
                tmc: element.region_station_TMC_modal ?? 0,
                tmvol: element.region_station_TMVOL_modal ?? 0,
                mlt: element.region_station_MLT_modal ?? 0,
                tm_lucro_bruto_operacional: (element.region_station_LUCRO_BRUTO_OPERACIONAL_modal ?? 0) * 100,
                tm_lucro_bruto_operacional_galonagem: (element.region_station_LUCRO_BRUTO_GALONAGEM_modal ?? 0) * 100,
                tm_lucro_bruto_operacional_produto: (element.region_station_LUCRO_BRUTO_PRODUTO_modal ?? 0) * 100,
                etanol_comum: element.region_station_ETANOL_COMUM_comb ?? 0,
                gasolina_comum: element.region_station_GASOLINA_COMUM_comb ?? 0,
                oleo_diesel_b_s10_comum: element.region_station_OLEO_DIESEL_B_S10_COMUM_comb ?? 0,
                oleo_diesel_b_s500_comum: element.region_station_OLEO_DIESEL_B_S500_COMUM_comb ?? 0

            }));

            regions.forEach(regions => {

                const existsInResult = finalTM.some(item => item.id === regions.regions_uuid);

                if (!existsInResult) {
                    finalTM.push({
                        region_name: regions.regions_name ?? "",
                        id: regions.regions_uuid ?? 0,
                        tmp: 0,
                        tmf: 0,
                        tmc: 0,
                        tmvol: 0,
                        mlt: 0,
                        tm_lucro_bruto_operacional: 0,
                        tm_lucro_bruto_operacional_galonagem: 0,
                        tm_lucro_bruto_operacional_produto: 0,
                        etanol_comum: 0,
                        gasolina_comum: 0,
                        oleo_diesel_b_s10_comum: 0,
                        oleo_diesel_b_s500_comum: 0,
                    });
                }
            });


            return res.status(200).json({ data: finalTM })

        } catch (error) {
            return res.status(500).json({ message: `Não foi possível retornar os dados!: ${error}` })
        }

    }


}

export default new VariablesController()