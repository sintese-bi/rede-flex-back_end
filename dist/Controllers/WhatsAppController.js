"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/Controllers/WhatsAppController.ts
var WhatsAppController_exports = {};
__export(WhatsAppController_exports, {
  default: () => WhatsAppController_default
});
module.exports = __toCommonJS(WhatsAppController_exports);
var import_mongodb = require("mongodb");
var import_chart = require("chart.js");
import_chart.Chart.register(...import_chart.registerables);
var uri = process.env.MONGODBCREDENCIALS;
var client;
if (uri) {
  client = new import_mongodb.MongoClient(uri, {
    serverApi: {
      version: import_mongodb.ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });
}
var WhatsAppController = class {
  wppInfo() {
    return __async(this, null, function* () {
      try {
        yield client.connect();
        yield client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } catch (error) {
        console.error("An error occurred while connecting to MongoDB:", error);
      } finally {
        yield client.close();
      }
    });
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
};
var teste = new WhatsAppController();
var WhatsAppController_default = new WhatsAppController();
