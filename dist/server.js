"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var import_express3 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

// src/Controllers/VariableController.ts
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

// routes/variable.ts
var import_express = require("express");

// src/service/token.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acesso negado!" });
  try {
    const secret = process.env.SECRET;
    if (!secret) throw new Error("A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida.");
    import_jsonwebtoken.default.verify(token, secret);
    next();
  } catch (err) {
    res.status(401).json({ message: "O Token \xE9 inv\xE1lido!" });
  }
};
var token_default = checkToken;

// routes/variable.ts
var variableRouter = (0, import_express.Router)();
variableRouter.get("/variableset", token_default, VariableController_default.setVariables);
variableRouter.get("/databaseall", VariableController_default.dataBaseAll);
variableRouter.post("/databasecompany", VariableController_default.dataBaseCompany);
var variable_default = variableRouter;

// routes/user.ts
var import_express2 = require("express");

// src/Controllers/UserController.ts
var import_nodemailer2 = __toESM(require("nodemailer"));
var import_client2 = require("@prisma/client");
var import_bcrypt = __toESM(require("bcrypt"));
var import_dotenv2 = __toESM(require("dotenv"));
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
import_dotenv2.default.config();
var prisma2 = new import_client2.PrismaClient();
var pass = process.env.PASSGMAIL;
var transporter2 = import_nodemailer2.default.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  //Usar "false" para ambiente de desenvolvimento
  auth: {
    user: "noreplyredeflex@gmail.com",
    pass
  },
  tls: {
    rejectUnauthorized: true
    //Usar "false" para ambiente de desenvolvimento
  }
});
var UserController = class {
  //Controlador de registro do usuário
  registerUsers(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email, use_name, use_password, use_confirm_password } = req.body;
        const result = yield prisma2.users.findFirst({
          where: { use_email }
        });
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(use_email)) {
          return res.status(400).json({ message: "O email n\xE3o \xE9 v\xE1lido!" });
        }
        if (result) {
          return res.status(400).json({ message: "O email j\xE1 est\xE1 em uso!" });
        }
        if (use_password.length < 4) {
          return res.status(400).json({ message: "A senha precisa ter 4 ou mais caracteres!" });
        }
        if (use_password != use_confirm_password) {
          return res.status(400).json({ message: "A senha e a confirma\xE7\xE3o precisam ser iguais!" });
        }
        const saltRounds = 10;
        const passwordHash = import_bcrypt.default.hashSync(use_password, saltRounds);
        yield prisma2.users.create({
          data: {
            use_email,
            use_password: passwordHash,
            use_name
          }
        });
        const emailBody = `
                <p>Ol\xE1,${use_name}</p>
                <p>Seu registro foi efetuado com sucesso!</p>

            `;
        const mailOptions = {
          from: "noreplyredeflex@gmail.com",
          to: [use_email],
          subject: "Registro efetuado com sucesso!",
          html: emailBody
        };
        transporter2.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao enviar o email." });
          } else {
            return res.status(200).json({
              message: "Email enviado com sucesso! "
            });
          }
        });
        return res.status(200).json({ message: "Seus dados foram cadastrados com sucesso!" });
      } catch (error) {
        return res.status(400).json({ message: `N\xE3o foi poss\xEDvel registrar seus dados! ${error}` });
      }
    });
  }
  //Controlador de login do usuário
  login(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email, use_password } = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(use_email)) {
          return res.status(400).json({ message: "O email n\xE3o \xE9 v\xE1lido." });
        }
        const existingEmail = yield prisma2.users.findFirst(
          {
            select: { use_uuid: true, use_email: true, use_password: true, use_name: true, use_level: true },
            where: { use_email }
          }
        );
        const result = existingEmail == null ? void 0 : existingEmail.use_password;
        if (!existingEmail) {
          return res.status(404).json({ message: "Este email n\xE3o existe em nosso banco de dados!" });
        }
        const checkPassword = result ? import_bcrypt.default.compareSync(use_password, result) : false;
        if (!checkPassword) {
          return res.status(404).json({ message: "Senha inv\xE1lida" });
        }
        const secret = process.env.SECRET;
        if (secret === void 0) {
          return res.status(400).json({ message: "A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida." });
        }
        const token = import_jsonwebtoken2.default.sign(
          { id: existingEmail.use_uuid },
          secret
        );
        return res.status(200).json({ message: "Login efetuado com sucesso!", acesso: token, use_id: existingEmail.use_uuid, use_name: existingEmail.use_name });
      } catch (error) {
        return res.status(400).json({ message: `N\xE3o foi poss\xEDvel logar no aplicativo!${error}` });
      }
    });
  }
  //Inicia o processo de recuperação de senha enviando um email com um link de token único para o usuário. 
  //Também atualiza o registro do usuário com o token gerado.
  sendEmail(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email } = req.body;
        const search = yield prisma2.users.findFirst({ select: { use_uuid: true }, where: { use_email } });
        if (!search) {
          return res.status(400).json({ message: "Esse email n\xE3o existe!" });
        }
        const secret = process.env.SECRET;
        if (secret === void 0) {
          return res.status(400).json({ message: "A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida." });
        }
        const use_token = import_jsonwebtoken2.default.sign(
          { id: search.use_uuid },
          secret,
          { expiresIn: "1h" }
        );
        const saltRounds = 10;
        const passwordHash = import_bcrypt.default.hashSync(use_token, saltRounds);
        yield prisma2.users.update({
          data: { use_token: passwordHash },
          where: { use_uuid: search.use_uuid }
        });
        const mailOptions = {
          from: "noreplyredeflex@gmail.com",
          to: use_email,
          subject: "Recupera\xE7\xE3o de Senha",
          html: `
                <p>Clique no link abaixo para recuperar sua senha do Dashboard RedeFlex:</p>
                <a href="https://dashboard.redeflex.com.br/passwordRecovery?use_token=${use_token}&use_email=${use_email}">Recuperar Senha</a>
              `
        };
        transporter2.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao enviar o email." });
          } else {
            return res.status(200).json({
              token: use_token,
              message: "Token enviado para o email inserido!"
            });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar ou atualizar o token." });
      }
    });
  }
  //Controlador que cria uma nova senha para o usuário
  passwordRecover(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email, use_token } = req.query;
        if (!use_email || !use_token) {
          return res.status(400).json({ message: "Par\xE2metros ausentes na query." });
        }
        const search = yield prisma2.users.findFirst({ select: { use_uuid: true, use_token: true }, where: { use_email } });
        if (!search) {
          return res.status(400).json({ message: "Esse email n\xE3o existe!" });
        }
        const result = search.use_token;
        const checkPassword = yield import_bcrypt.default.compareSync(use_token, result);
        if (!checkPassword) {
          return res.status(401).json({ message: "O Token \xE9 inv\xE1lido!" });
        }
        const { use_password } = req.body;
        const user = yield prisma2.users.findUnique({
          where: {
            use_uuid: search.use_uuid,
            use_token: result
          }
        });
        if (!user) {
          return res.status(400).json({ message: "Token ou email inv\xE1lido." });
        }
        try {
          const secret = process.env.SECRET;
          if (secret === void 0) {
            return res.status(400).json({ message: "A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida." });
          }
          const decoded = import_jsonwebtoken2.default.verify(use_token, secret);
          if (typeof decoded === "string") {
            return res.status(401).json({ message: "Token inv\xE1lido." });
          }
          const currentTime = Date.now() / 1e3;
          if (decoded.exp && decoded.exp < currentTime) {
            return res.status(401).json({ message: "Token expirado." });
          }
        } catch (err) {
          return res.status(401).json({ message: "Token inv\xE1lido." });
        }
        if (use_password.length < 4) {
          return res.status(400).json({ message: "A senha precisa ter 4 ou mais caracteres!" });
        }
        const saltRounds = 10;
        const passwordHash = import_bcrypt.default.hashSync(use_password, saltRounds);
        yield prisma2.users.update({
          data: { use_token: null },
          where: { use_uuid: search.use_uuid }
        });
        yield prisma2.users.update(
          {
            data: { use_password: passwordHash },
            where: { use_uuid: search.use_uuid }
          }
        );
        return res.status(200).json({
          message: "Senha atualizada com sucesso!"
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar nova senha!" });
      }
    });
  }
};
var UserController_default = new UserController();

// routes/user.ts
var userRouter = (0, import_express2.Router)();
userRouter.post("/register", UserController_default.registerUsers);
userRouter.post("/login", UserController_default.login);
userRouter.post(`/sendemail`, UserController_default.sendEmail);
userRouter.post(`/password_recovery`, UserController_default.passwordRecover);
var user_default = userRouter;

// src/server.ts
var app = (0, import_express3.default)();
var PORT = 3051;
var apiVersion = "v1";
var corsOptions = {
  origin: [/https:\/\/redeflexbi\.com\.br($|\/.*)/, "http://localhost:3000"]
};
app.use((0, import_cors.default)(corsOptions));
app.get(`/${apiVersion}`, function(req, res) {
  res.send("Hello World!");
});
app.use(import_express3.default.json());
app.use(`/${apiVersion}`, variable_default);
app.use(`/${apiVersion}`, user_default);
app.listen(
  PORT,
  () => console.log(`\u2728 Server started on ${PORT}`)
);
