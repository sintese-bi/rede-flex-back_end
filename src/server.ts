import express from "express";
import cors from "cors";
import variableRouter from "../routes/variable";
import userRouter from "../routes/user";
// import wppRouter from "../routes/wpp";
const app = express();
const PORT = 8080;
const apiVersion = "v1";

const corsOptions = {
    origin: [/https:\/\/redeflexbi\.com\.br($|\/.*)/, "http://localhost:3000"]
};


app.use(cors(corsOptions));

app.get(`/${apiVersion}`, function (req, res) {
    res.send('Hello World!');
});


app.use(express.json());
app.use(`/${apiVersion}`, variableRouter);
app.use(`/${apiVersion}`, userRouter);
// app.use(`/${apiVersion}`, wppRouter);
app.listen(PORT, () =>
    console.log(`✨ Server started on ${PORT}`)
);
