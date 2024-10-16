import VariablesController from "../src/Controllers/VariableController";
import express, { Router } from "express";
import checkToken from "../src/service/token";
const variableRouter = Router()
variableRouter.get("/variable-name", VariablesController.variableName)
variableRouter.get("/sum-fuel-literage", VariablesController.SumFuelProduct)
variableRouter.get("/map-position/:use_token", checkToken, VariablesController.mapPosition)
variableRouter.post("/name-table/:filter", checkToken, VariablesController.nameTable)
// variableRouter.post("/name-regional-table", checkToken, VariablesController.RegionalNamesTable)
variableRouter.post("/alerts-log", checkToken, VariablesController.alertsLog)
variableRouter.post("/modal-insert-tm/:use_token", checkToken, VariablesController.saveModalMargins)
variableRouter.get("/modal-return-tm/:use_token", checkToken, VariablesController.returnModalMargins)
//Modal por postos
variableRouter.get("/modal-station-return-tm/:use_token", checkToken, VariablesController.modalStationsReturn)
variableRouter.post("/modal-station-insert-tm/:use_token", checkToken, VariablesController.modalStationsInsert)
//Modal por regiões
variableRouter.post("/modal-regions-insert-tm/:use_token", checkToken, VariablesController.modalRegionsInsert)
variableRouter.get("/modal-regions-return-tm/:use_token", checkToken, VariablesController.modalRegionsReturn)

variableRouter.post("/update-alert/:filter", checkToken, VariablesController.updateInfo)
// variableRouter.post("/update-region-alert", checkToken, VariablesController.updateRegionsAlertInfo)
variableRouter.get("/cep", VariablesController.CEP)
// variableRouter.post("/consulting",  VariablesController.consulting)
// variableRouter.post("/login", UserController.login)
// variableRouter.post(`/sendemail`, UserController.sendEmail)

export default variableRouter
