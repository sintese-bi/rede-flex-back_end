import { Router } from "express"
import UserController from "../src/Controllers/UserController"
import checkToken from "../src/service/token"
const userRouter = Router()

userRouter.post("/register", UserController.registerUsers)
userRouter.post("/login", UserController.login)
userRouter.post(`/sendemail`, UserController.sendEmail)
userRouter.post(`/password_recovery`, UserController.passwordRecover)
export default userRouter