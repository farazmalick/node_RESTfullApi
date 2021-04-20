const mongoose=require('mongoose')
const User=require('../models/user')

const taskSchema=new mongoose.Schema({
    des:
    {
        type:String,
        required:true
    },
    completed:
    {
        type:Boolean
    },
    user_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{timestamps:true})


const Task=mongoose.model('Task',taskSchema)

module.exports=Task