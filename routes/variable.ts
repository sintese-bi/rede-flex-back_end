import VariablesController from "../src/Controllers/VariableController";
import express, { Router } from "express";
import checkToken from "../src/service/token";
const variableRouter = Router()

variableRouter.get("/databaseall", VariablesController.dataBaseAll)
variableRouter.post("/databasecompany", VariablesController.dataBaseCompany)
variableRouter.get("/variable-name", VariablesController.variableName)
variableRouter.get("/sum-fuel-literage", VariablesController.SumFuelProduct)
variableRouter.get("/map-position", checkToken, VariablesController.mapPosition)
variableRouter.get("/mock-name-station", checkToken, VariablesController.nameFuelStationMock)
variableRouter.get("/mock-alerts", checkToken, VariablesController.alertsMock)
variableRouter.get("/cep",VariablesController.CEP)
// variableRouter.post("/consulting",  VariablesController.consulting)
// variableRouter.post("/login", UserController.login)
// variableRouter.post(`/sendemail`, UserController.sendEmail)

export default variableRouter
