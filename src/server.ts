import express from "express";
import cors from "cors";
import variableRouter from "../routes/variable";
import userRouter from "../routes/user";
import wppRouter from "../routes/wpp";
// import wppRouter from "../routes/wpp";
const app = express();
const PORT = 3051;
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
// app.use(`/${apiVersion}`, wppRouter);
app.use(`/${apiVersion}`, userRouter);

app.listen(PORT, () =>
    console.log(`✨ Server started on ${PORT}`)
);
