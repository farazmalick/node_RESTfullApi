const mongoose=require('mongoose')


const url='mongodb://127.0.0.1:27017/node_restapi'

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((res)=>
{
    console.log('connected')
})
.catch((error)=>
{
    console.log(error)
})