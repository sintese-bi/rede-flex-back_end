import { Prisma } from "@prisma/client";
import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import { MongoClient, ServerApiVersion } from 'mongodb';
import PDFDocument from "pdfkit";
import fs from "fs";
// import { createCanvas } from "canvas";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
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
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// let data: any = {
//     unidade: "Felipe VGP - 4 kWp",
//     periodo: "05-2024",
//     pagaria_sem_usina: "691606.08",
//     pago: "291351.36",
//     economia: "400254.72",
//     consumo_total: "720423",
//     geracao_real: "231312",
//     geracao_estimada: "416932",
//     desempenho: "2983.498633234583",
//     consumida: "220,00",
//     injetada: "183,00",
//     faturada: "170,00",
//     compensada: "50,00",
//     credito_anterior: "655508.1012999995",
//     credito_compensado: "0",
//     credito_transferido: "410609",
//     credito_expirado: "0",
//     credito_atual: "726784.3178999993",
//     vencimento: "02/2029",
//     fluxo_consumo: "0",
//     arvores: "0",
//     co2: "0.05",
//     producao_mensal: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650],
//     producao_diaria: Array.from(
//         { length: 31 },
//         () => Math.floor(Math.random() * 100) + 1
//     ),
// };
// const prisma = new PrismaClient();

class WhatsAppController {
    public async wppInfo() {
        try {
            // Connect the client to the server (optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } catch (error) {
            // Handle the error here
            console.error("An error occurred while connecting to MongoDB:", error);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
//     public async createPDF(): Promise<void> {
//         function createChart(
//             data: number[],
//             labels: string[],
//             title: string,
//             label: string
//         ): Buffer {
//             const canvas = createCanvas(800, 400);
//             const ctx: any = canvas.getContext("2d");

//             new Chart(ctx, {
//                 type: "bar",
//                 data: {
//                     labels: labels,
//                     datasets: [
//                         {
//                             label: label,
//                             data: data,
//                             backgroundColor: "rgba(75, 192, 192, 0.5)",
//                             borderColor: "rgba(75, 192, 192, 1)",
//                             borderWidth: 1,
//                         },
//                     ],
//                 },
//                 options: {
//                     plugins: {
//                         title: {
//                             display: true,
//                             text: title,
//                         },
//                     },
//                     scales: {
//                         y: {
//                             beginAtZero: true,
//                             grid: {
//                                 display: false,
//                             },
//                         },
//                         x: {
//                             grid: {
//                                 display: false,
//                             },
//                         },
//                     },
//                 },
//             });

//             return canvas.toBuffer();
//         }

//         const doc = new PDFDocument({ margin: 30 });
//         doc.pipe(fs.createWriteStream("output.pdf"));

//         // Título
//         doc.fontSize(12).text(`${data.unidade}`, { align: "left" });
//         doc.fontSize(12).text("Segue os resultados da sua Usina:", { align: "left" });
//         doc.moveDown();

//         // Unidade
//         doc.fontSize(12).text(`Unidade: ${data.unidade}`, { align: "center" });
//         doc.moveDown();

//         // Período
//         doc.fontSize(12).text(`Período: ${data.periodo}`, { align: "center" });

//         doc.text(`Economia (R$): ${data.economia}`, { align: "left" });
//         doc.text(`Geração Estimada (KWH): ${data.geracao_estimada}`, { align: "left" });
//         doc.text(`Geração Real (KWH): ${data.geracao_real}`, { align: "left" });
//         doc.text(`Desempenho (%): ${data.desempenho}`, { align: "left" });
//         doc.moveDown();

//         // Fluxo de Energia


//         doc.moveDown();

//         // Contribuição para o mundo
//         doc.fontSize(12).text("Sua contribuição para o mundo", { align: "left" });

//         doc.fontSize(10).text(`Árvores foram cultivadas: ${data.arvores}  Toneladas de CO2 evitados: ${data.co2}`, { align: "center" });
//         // doc.fontSize(10).text(`Toneladas de CO2 evitados: ${data.co2}`, { align: "right" });
//         doc.moveDown();

//         // Adiciona o gráfico de produção mensal
//         const monthlyLabels = [
//             "Jan",
//             "Feb",
//             "Mar",
//             "Apr",
//             "May",
//             "Jun",
//             "Jul",
//             "Aug",
//             "Sep",
//             "Oct",
//             "Nov",
//             "Dec",
//         ];
//         const monthlyChartBuffer = createChart(
//             data.producao_mensal,
//             monthlyLabels,
//             "Produção Mensal (kWh)",
//             "Produção Mensal"
//         );
//         const availableSpace = doc.page.height - doc.y - doc.page.margins.bottom;
//         if (availableSpace < 350) {
//             doc.addPage();
//         }
//         doc.image(monthlyChartBuffer, {
//             fit: [500, 300],
//             align: "center",
//             valign: "center",
//         });
//         doc.addPage(); // Adiciona nova página antes do próximo gráfico

//         // Adiciona o gráfico de produção diária
//         const dailyLabels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
//         const dailyChartBuffer = createChart(
//             data.producao_diaria,
//             dailyLabels,
//             "Produção Diária (kWh)",
//             "Produção Diária"
//         );
//         doc.image(dailyChartBuffer, {
//             fit: [500, 300],
//             align: "center",
//             valign: "center",
//         });
//         doc.moveDown();

//         // Finaliza o documento
//         doc.end();


    }


// }
const teste = new WhatsAppController()

// teste.wppInfo().catch(console.dir);
export default new WhatsAppController()