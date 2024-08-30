const express=require('express');
const router=express.Router();
const User=require('../models/user')
const {jwtAuthMiddleware,genarateToken}=require('../jwt');
const Candidate = require('../models/candidate');



//create a function for admin

const checkAdminRole=async (userID)=>{
  try{
      const user=await User.findById(userID);
      if(user.role === 'admin'){
        return true;
      }
  }catch(err){
      return false;
  }
}


//post route to add a candidate
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{

      if(! await checkAdminRole(req.user.id))
        return res.status(403).json({message:"user does not have admin role"});
     
      const data=req.body//assuming the request body contain the candidate data
    
     //create a new candidate document using mpngodb model
 
     const newCandidate=new Candidate(data);
 
     //save the new User to the database
     const respons=await newCandidate.save();
     console.log('data saved');

     res.status(200).json({respons:respons});
      }catch(err){
       console.log(err);
       res.status(500).json({error:'internal server error'});
    }
})

router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{

        if(!checkAdminRole(req.user.id))
          return res.status(403).json({message:"user does not have admin role"});
     
        const candidateID=req.params.candidateID;//extract the id from the url parameter
        const updatecandidateData=req.body;//update data for the candidate
        const response=await person.findByIdAndUpdate(candidateID,updatecandidateData,{
            new:true,
            runValidators:true,
        })
        if(!response){
            return res.json({error:'candidate not found'});
        }
        console.log(' candidate data updated')
        res.json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'});
    }
})

router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
  try{

      if(!checkAdminRole(req.user.id))
        return res.status(403).json({message:"user does not have admin role"});
   
      const candidateID=req.params.candidateID;//extract the id from the url parameter
       const response=await person.findByIdAndDelete(candidateID);

      if(!response){
          return res.json({error:'candidate not found'});
      }

      console.log(' candidate deleted')
      res.json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({error:'internal server error'});
  }
})

//let's start voting

router.post('/vote/:candidateID',jwtAuthMiddleware,async (req,res)=>{


  //no admin can vote
  //user can only vote once

  candidateID=req.params.candidateID;
  userId=req.user.id;

  try{

    //find the candidate document with the specified candidateID
    const candidate= await Candidate.findById(candidateID);

    if(!candidate){
      return res.status(404).json({message:"Candidate not found"});
    }

    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"Candidate not found"});
    }

    if(user.isVote){
      res.status(400).json({message:"you have already voted"})
    }

    if(user.role=='admin'){
      res.status(403).json({message:"admin is not allowed"});
    }

    //Update the candidate document to recored the vote
    candidate.votes.push({user:userId})
    candidate.voteCount++;
    await candidate.save();


    //update the user document
    user.isVote=true
    await user.save();

    res.status(200).json({message:"vote recored succesfully"});
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
  }
})


//vote count

router.get('/vote/count',async (req,res)=>{
  try{

    //find all candidates and sort them by voteCount in descending order

    const candidate=await Candidate.find().sort({voteCount:'desc'});

    //map the candidate to only return their name and voteCount
    const voteRecord=candidate.map((data)=>{
      return{
        party:data.party,
        count:data.voteCount
      }
    });

    return res.status(200).json(voteRecord);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
  }
  
});
module.exports=router;

 