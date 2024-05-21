import UserController from "../src/Controllers/UserController";
import express, { Router } from "express";
// import checkToken from "../src/service/token";
const userRouter = Router()

userRouter.get("/register", UserController.setVariables)
// userRouter.post("/login", UserController.login)
// userRouter.post(`/sendemail`, UserController.sendEmail)

export default userRouter
