"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/Controllers/VariableController.ts
var VariableController_exports = {};
__export(VariableController_exports, {
  default: () => VariableController_default
});
module.exports = __toCommonJS(VariableController_exports);
var import_nodemailer = __toESM(require("nodemailer"));
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var transporter = import_nodemailer.default.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  //Usar "false" para ambiente de desenvolvimento
  auth: {
    user: "",
    pass: process.env.PASSGMAIL
  },
  tls: {
    rejectUnauthorized: false
    //Usar "false" para ambiente de desenvolvimento
  }
});
var VariablesController = class {
  setVariables(req, res) {
    return __async(this, null, function* () {
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
          use_volume_total_min
        } = req.body;
        yield prisma.users.updateMany({
          data: {
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
            use_volume_total_min
          },
          where: { use_name }
        });
        return res.status(200).json({ message: "Os dados foram atualizados com sucesso!" });
      } catch (error) {
        return res.status(500).json({ message: `N\xE3o foi poss\xEDvel registrar seus dados! ${error}` });
      }
    });
  }
  dataBaseAll(req, res) {
    return __async(this, null, function* () {
      try {
        const result = yield prisma.basedados.findMany({
          select: {
            company_emp: true,
            company_name: true,
            company_date: true,
            company_week_day: true,
            company_fuel: true,
            company_volume: true,
            company_cost: true,
            company_sale: true,
            company_profit: true
          }
        });
        return res.status(200).json({ data: result });
      } catch (error) {
        return res.status(500).json({ message: `N\xE3o foi poss\xEDvel retornar seus dados! ${error}` });
      }
    });
  }
  dataBaseCompany(req, res) {
    return __async(this, null, function* () {
      try {
        const { company_name, company_emp } = req.body;
        const result = yield prisma.basedados.findFirst({
          select: {
            company_emp: true,
            company_name: true,
            company_date: true,
            company_week_day: true,
            company_fuel: true,
            company_volume: true,
            company_cost: true,
            company_sale: true,
            company_profit: true
          },
          where: { company_emp, company_name }
        });
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(500).json({ message: `N\xE3o foi poss\xEDvel retornar seus dados! ${error}` });
      }
    });
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
};
var VariableController_default = new VariablesController();
