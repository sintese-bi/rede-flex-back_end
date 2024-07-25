import VariablesController from "../src/Controllers/VariableController";
import express, { Router } from "express";
import checkToken from "../src/service/token";
const variableRouter = Router()

variableRouter.post("/variable-set", checkToken, VariablesController.setVariables)
variableRouter.get("/databaseall", VariablesController.dataBaseAll)
variableRouter.post("/databasecompany",  VariablesController.dataBaseCompany)
variableRouter.get("/variable-name", VariablesController.variableName)
variableRouter.get("/sum-fuel-literage", VariablesController.SumFuelProduct)
variableRouter.get("/dataframe-gallonage", VariablesController.dataFrameGallonage)
variableRouter.get("/dataframe-fuel", VariablesController.dataFrameFuel)
// variableRouter.post("/consulting",  VariablesController.consulting)
// variableRouter.post("/login", UserController.login)
// variableRouter.post(`/sendemail`, UserController.sendEmail)

export default variableRouter
