const express=require('express')
const Task=require('../models/task')
const User=require('../models/task')
const router=new express.Router()
const auth=require('../middleware/auth')

router.post('/tasks',auth,async (req,res)=>
{
    try
    {
        const task=new Task({...req.body,user_id:req.user._id})
        await task.save()
        res.status(201).send(task)
    }
    catch(error)
    {
        res.status(400).send()
    }
})
router.get('/tasks',auth,async (req,res)=>
{
    try
    {
        const match={}
        const sort={}
        if(req.query.sortBy)
        {
            const parts=req.query.sortBy.split(':')
            console.log(parts)
            sort[parts[0]]=parts[1]==='desc'?-1:1
        }
        
        if(req.query.completed)
        {
            match.completed=req.query.completed==='true'
        }
        await req.user.populate({
            path:'tasks',
            match,
            options:
            {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(error){
        res.status(400).send()
    }
})

router.get('/tasks/:id',auth,async(req,res)=>
{
    try
    {
        const task=await Task.findOne({_id:req.params.id,user_id:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(error)
    {
        res.status(400).send()
    }
})

router.patch('/tasks/:id',auth,async (req,res)=>
{
    try{
        const allowedUpdates=['des','completed']
        const updates=Object.keys(req.body)
        const isAllwoed=updates.every((update)=>allowedUpdates.includes(update))
        
        if(!isAllwoed)
        {
            return res.status(400).send
        }
        const task=await Task.findOne({_id:req.params.id,user_id:req.user._id})
        
        if(!task)
        {
            res.status(404).send()
        }
        updates.forEach((update)=>task[update]=req.body[update] )
        res.send(task)
    }
    catch(error)
    {
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>
{
    try{
        const task=await Task.findOne({_id:req.params.id,user_id:req.user._id})
        if(!task)
        {
            return res.status(404).send
        }
        
        await task.remove()
        res.send()
    }
    catch(error)
    {
        res.status(500).send()
    }
})


module.exports=router