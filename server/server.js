import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config.js"; 
import authRoutes from "./routes/auth.js"
import adRoutes from "./routes/ad.js"

const app = express();

//db
mongoose.set("strictQuery", false)
mongoose
  .connect(DATABASE)
  .then(() =>
    console.log("mongoDB welcome you! you are successufully connected with me!")
  )
  .catch((err)=> console.log(err));

//Middlewares
app.use(express.json({limit:"10mb"})); //with the help of which all the data display on console in json.
app.use(morgan("dev"));
app.use(cors());

//routes middleware
app.use('/api', authRoutes) //matlab yeh jo hai root route bn gya hai sb start hoga "/api" se authRoutes router mae hai then this is the connection between router and the controller.
//client send request and server is send response.
app.use("/api", adRoutes)
app.listen(8000, () => console.log("server running on port 8000"));
