const express=require('express');
const router=express.Router();
const User=require('../models/user');
const {jwtAuthMiddleware,genarateToken}=require('../jwt')

router.post('/signup',async(req,res)=>{
    try{
     const data=req.body//assuming the request body contain the person data
    
     //create a new User document using mpngodb model
 
     const newUser=new User(data);
 
     //save the new User to the database
     const respons=await newUser.save();
     console.log('data saved');

     const payLoad={
      id:respons.id
     }
     console.log(JSON.stringify(payLoad));
     const token=genarateToken(payLoad);
     console.log("token is: ",token);


     res.status(200).json({respons:respons,token:token});
    }catch(err){
       console.log(err);
       res.status(500).json({error:'internal server error'});
    }
})


//Login route
router.post('/login',async(req,res)=>{
  try{
    //Extract username and password from request body
    const{aadharCardNumber,password}=req.body;

    //find the user by aadharCardNumber
    const user=await User.findOne({aadharCardNumber:aadharCardNumber});

    //if user does not exist or password doesnot match return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:'invalid username or password'})
    }

    //genarate token
    const payload={
      id:User.id
    }
    const token=genarateToken(payload);

    //return token as respons
    res.json({token})
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});

  }
})


//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try{
   const userData=req.user;
   const userId=userData.id;
   const user=await person.findById(userId);
   res.status(200).json({user});
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
  }
})


 
 

router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId=req.user;//extract the id from token
        const {currentPassword,newPassword}=req.body//extract the current and new password from body
        
        //find the user by userId
        const user=await User.findById({userId});

        //if password doesnot match return error
        if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error:'invalid username or password'})
        }
        
        //update the user password
        User.password=newPassword;
        await user.save();
        
        
         console.log('password updated')
        res.json({message:"Password updated"});

    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'});
    }
})

 


module.exports=router;