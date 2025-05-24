import express from "express"
import bodyParser from "body-parser"
import router from "./src/routes/api.js"


const app = express()
const port = 3000;

app.get("/", router)




app.listen(port, () => { console.log("server.js is started")})


