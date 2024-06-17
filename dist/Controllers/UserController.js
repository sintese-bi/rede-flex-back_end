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

// src/Controllers/UserController.ts
var UserController_exports = {};
__export(UserController_exports, {
  default: () => UserController_default
});
module.exports = __toCommonJS(UserController_exports);
var import_nodemailer = __toESM(require("nodemailer"));
var import_client = require("@prisma/client");
var import_bcrypt = __toESM(require("bcrypt"));
var import_dotenv = __toESM(require("dotenv"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
import_dotenv.default.config();
var prisma = new import_client.PrismaClient();
var pass = process.env.PASSGMAIL;
var transporter = import_nodemailer.default.createTransport({
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
        const result = yield prisma.users.findFirst({
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
        yield prisma.users.create({
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
        transporter.sendMail(mailOptions, function(error, info) {
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
        const existingEmail = yield prisma.users.findFirst(
          {
            select: { use_uuid: true, use_email: true, use_password: true, use_name: true },
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
        const token = import_jsonwebtoken.default.sign(
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
        const search = yield prisma.users.findFirst({ select: { use_uuid: true }, where: { use_email } });
        if (!search) {
          return res.status(400).json({ message: "Esse email n\xE3o existe!" });
        }
        const secret = process.env.SECRET;
        if (secret === void 0) {
          return res.status(400).json({ message: "A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida." });
        }
        const use_token = import_jsonwebtoken.default.sign(
          { id: search.use_uuid },
          secret,
          { expiresIn: "1h" }
        );
        const saltRounds = 10;
        const passwordHash = import_bcrypt.default.hashSync(use_token, saltRounds);
        yield prisma.users.update({
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
        transporter.sendMail(mailOptions, function(error, info) {
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
        const search = yield prisma.users.findFirst({ select: { use_uuid: true, use_token: true }, where: { use_email } });
        if (!search) {
          return res.status(400).json({ message: "Esse email n\xE3o existe!" });
        }
        const result = search.use_token;
        const checkPassword = yield import_bcrypt.default.compareSync(use_token, result);
        if (!checkPassword) {
          return res.status(401).json({ message: "O Token \xE9 inv\xE1lido!" });
        }
        const { use_password } = req.body;
        const user = yield prisma.users.findUnique({
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
          const decoded = import_jsonwebtoken.default.verify(use_token, secret);
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
        yield prisma.users.update({
          data: { use_token: null },
          where: { use_uuid: search.use_uuid }
        });
        yield prisma.users.update(
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
