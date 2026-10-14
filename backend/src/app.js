import express from "express";
import cors from "cors";
import computadorRoutes from "./routes/computador.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/computadores", computadorRoutes);

export default app;