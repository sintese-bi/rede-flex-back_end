import { Router } from "express"
import UserController from "../src/Controllers/UserController"
const userRouter = Router()

userRouter.post("/register", UserController.registerUsers)
export default userRouter