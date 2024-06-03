import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri: string | undefined = process.env.MONGODBCREDENCIALS
let client: any
if (uri) {
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const prisma = new PrismaClient();

class WhatsAppController {
    public async wppInfo() {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

    }


}
const teste = new WhatsAppController()
teste.wppInfo().catch(console.dir);
export default new WhatsAppController()