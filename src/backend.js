import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // ✅ CORS applied first
app.use(express.json());
app.use("/", routes);

app.listen(5000,()=>{
    console.log("app is running at port 5000");
})