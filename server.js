import express from "express";
import cors from "cors";
import "dotenv/config"
import dbConfig from "./configs/dbConfig.js";

const app = express();
const port = 3000;

await dbConfig();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=> res.send("Server is live"));

app.listen(port,()=>{
    console.log(`Server listening at http://localhost:${port}`);
})