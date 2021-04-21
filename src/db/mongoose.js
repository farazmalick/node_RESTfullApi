const mongoose=require('mongoose')


//const url='mongodb://127.0.0.1:27017/node_restapi'

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((res)=>
{
    console.log('connected')
})
.catch((error)=>
{
    console.log(error)
})