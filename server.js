import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import dbConfig from "./configs/dbConfig.js";

import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/api/auth/", authRoutes);

app.get("/", (req, res) => res.send("Server is live"));

const startServer = async () => {
  await dbConfig();
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
};
startServer();
