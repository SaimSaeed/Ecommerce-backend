import path from "path"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import { notFound,errorHandler } from "./middleware/errorMiddleware.js"
import ServerlessHttp from "serverless-http"
dotenv.config()


const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOptions = {
    origin: "http://localhost:3000",  // Replace this with the correct port if different
    credentials: true,  // Allow credentials like cookies
    optionsSuccessStatus: 200,
};
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database is Connected!")
})
.catch((err)=>{
    console.log(err)
})
app.use(cors(corsOptions));
    app.get("/api/",(req,res)=>{
        res.send("Api is running...")
    })

app.use("/api/products",productRoutes)
app.use("/api/user",authRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api/config/paypal",(req,res)=>{
    res.send({clientId:process.env.CLIENT_ID})
})
const __dirname = path.resolve()  //setting directory to current directory
app.use("/upload",express.static(path.join(__dirname,"/upload")))



if(process.env.NODE_ENV=== "production"){
//    set static folder
// app.use(express.static(path.join(__dirname,"/client/build")))
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// any route that is not api will be redirected to index.html
app.get("*",(req,res)=>{
//  res.sendFile(path.resolve(__dirname,"client","build","index.html"))
res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
})
}else{
    app.get("/",(req,res)=>{
        res.send("Api is running...")
    })
}

app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 8000


app.listen(port,()=>{
    console.log("Server is Running!",port)
})

// export const handler = ServerlessHttp(app);
