const http=require('http');
const express = require('express');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const PORT=process.env.PORT ||3000;
require("./config/db")();

const bodyParser=require('body-parser');
app.use(bodyParser.json());//req.body

 




//import the router files
const userRouter=require('./routes/userRoutes');
const candidateRouter=require('./routes/candidateRoutes');

 //use the routers
app.use('/user',userRouter);
app.use('/candidate',candidateRouter);
 







let server = http.createServer(app);
server.listen(PORT,function(err){
    if(err)throw err;
    console.log(`server is running on port: ${PORT}`)
});