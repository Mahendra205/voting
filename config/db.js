const mongoose=require('mongoose');
module.exports=()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully');
    }catch(err){
        console.log('MongoDB connection error',err);
    }
}