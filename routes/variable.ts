import VariablesController from "../src/Controllers/VariableController";
import express, { Router } from "express";
import checkToken from "../src/service/token";
const variableRouter = Router()

variableRouter.get("/variableset", checkToken, VariablesController.setVariables)
variableRouter.get("/databaseall", VariablesController.dataBaseAll)
variableRouter.post("/databasecompany",  VariablesController.dataBaseCompany)
// variableRouter.post("/consulting",  VariablesController.consulting)
// variableRouter.post("/login", UserController.login)
// variableRouter.post(`/sendemail`, UserController.sendEmail)

export default variableRouter
