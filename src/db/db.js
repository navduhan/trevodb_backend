const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1/reodb")
.then(console.log("Database connected"))
.catch(e=>{console.error('connection errro', e.message)})


module.exports = connectDB = mongoose.connection