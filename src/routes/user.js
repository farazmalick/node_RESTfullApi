const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')

const router =new express.Router()

router.post('/users',async (req,res)=>
{
    try
    {
        const user=new User(req.body)
        const token=await user.generateJWT()
        
        await user.save()
        res.status(201).send({user,token})
        
    }
    catch(err)
    {
        res.status(400).send()
    }
    
})

router.post('/users/login',async (req,res)=>
{
    try
    {
        const user=await User.findByCredidentils(req.body.email,req.body.password)
        if(!user)
        {
            res.status(404).send()
        }
        const token=await user.generateJWT()
        res.send({user,token})
    }
    catch(err)
    {
        res.status(400).send()
    }
})

router.get('/users',auth,(req,res)=>
{
    res.send(req.user)
})

router.patch('/users',auth,async (req,res)=>
{
    try
    {
        const allowedUpdates=['name','email','pasword','age']
    const updates=Object.keys(req.body)
    const isAllowed=updates.every((update)=> allowedUpdates.includes(update))
    if(!isAllowed)
    {
        return res.status(400).send('field not allowed')
    }
    updates.forEach((update)=>req.user[update]=req.body[update])
    const user=await req.user.save()
    res.send(user)


    }
    catch(err)
    {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>
{
try
{
    req.user.tokens=req.user.tokens.filter((token)=>req.token!=token.token)
    await req.user.save()
    res.send()
}
catch(err)
{
    res.status(400).send()
}
})

router.post('/users/logoutAll',auth,async (req,res)=>
{
try
{
    req.user.tokens=[]
    await req.user.save()
    res.send()
}
catch(err)
{
    res.status(400).send()
}
})

router.delete('/users',auth,async (req,res)=>
{
    try
    {
        await req.user.remove()
        res.send()
    }
    catch(error)
    {
        res.status(500).send()
    }

})
///file/image section
const upload=multer({
    limits:
    {
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/.(jpg|jpeg|png)$/))
        {
            new cb(Error('unwanted format')) 
        }
        cb(undefined,true)
    }
})
router.post('/users/img',auth,upload.single('img'),async (req,res)=>
{
    try{
        req.user.img=req.file.buffer
        await req.user.save()
        res.status(201).send()
    }
    catch(err)
    {
        res.status(400).send()
    }
})

router.get('/users/img',auth,async (req,res)=>
{
    try{
        if(!req.user.img)
        {
            return res.status(404).send()
        }
        res.set('Content-Type','image/jpg')
        res.send(req.user.img)
    }
    catch(error)
    {
        res.status(404).send()
    }
})

router.delete('/users/img',auth,async (req,res)=>
{
    try{
        if(!req.user.img)
        {
            return res.status(500).send()
        }
        req.user.img=undefined
        await req.user.save()
        res.send()
    }
    catch(error)
    {
        res.status(500).send()

    }
})
module.exports=router