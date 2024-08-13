const express = require('express')
const cors = require('cors')
const connectDB = require("./src/db/db")


const app = express()
const apiPort = 3200
const routes  = require('./src/routes/trevodb-routes')


app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())


connectDB.on('error', console.error.bind(console, 'MongoDB connection error:'))


app.use("/api", routes)

app.listen(apiPort, ()=> console.log(`Server runnning on port ${apiPort}`))