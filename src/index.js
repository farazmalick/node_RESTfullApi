require('./db/mongoose')
const express=require('express')
const userRouter=require('./routes/user')
const taskRouter=require('./routes/task')


//const PORT=3000
const app=express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)




app.listen(process.env.PORT,()=>
{
    console.log(`listening on Port ${process.env.PORT}`)
})

