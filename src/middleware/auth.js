const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async (req,res,next)=>
{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        
    const decoded=await jwt.verify(token,'node_restapi')
    
    const user=await User.findOne({_id:decoded._id,'tokens.token':token})
    if(!user)
    {
        throw new error('please authorize')
    }
    req.user=user
    req.token=token
    next()
    }
    catch(error)
    {
        res.status(401).send('please authorize')
    }

}

module.exports=auth