import VariablesController from "../src/Controllers/VariableController";
import express, { Router } from "express";
import checkToken from "../src/service/token";
const variableRouter = Router()
variableRouter.get("/variable-name", VariablesController.variableName)
variableRouter.get("/sum-fuel-literage", VariablesController.SumFuelProduct)
variableRouter.get("/map-position", checkToken, VariablesController.mapPosition)
variableRouter.post("/name-table/:filter", checkToken, VariablesController.nameTable)
// variableRouter.post("/name-regional-table", checkToken, VariablesController.RegionalNamesTable)
variableRouter.get("/mock-alerts", checkToken, VariablesController.alertsMock)
variableRouter.post("/update-alert/:filter", checkToken, VariablesController.updateInfo)
variableRouter.post("/update-region-alert", checkToken, VariablesController.updateRegionsAlertInfo)
variableRouter.get("/cep", VariablesController.CEP)
// variableRouter.post("/consulting",  VariablesController.consulting)
// variableRouter.post("/login", UserController.login)
// variableRouter.post(`/sendemail`, UserController.sendEmail)

export default variableRouter
