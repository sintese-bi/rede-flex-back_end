import express, { Router } from "express";
import WhatsAppController from "../src/Controllers/WhatsAppController";

const wppRouter = Router()

wppRouter.get('/whatsapp', WhatsAppController.wppInfo)


export default wppRouter