const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const userSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    password:
    {
        type:String,
        required:true,
        minlength:7,
        trim:true
    },
    age:
    {
        default:0,
        type:Number
    },
    tokens:
    [{
        token:
        {
            type:String
        }
    }],
    img:
    {
        type:Buffer
    }

},{timestamps:true})



userSchema.pre('save',async function(next)
{
    const user=this
    
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
        
    }
    next()
})

userSchema.statics.findByCredidentils=async (email,password)=>
{
    const user= await User.findOne({email})
    
    if(!user)
    {
        throw new Error('invalid credidentials')
    }
    const isValid=await bcrypt.compare(password,user.password)
    if(!isValid)
    {
        throw new Error('invalid credidentials')
    }
    return user
}

userSchema.methods.generateJWT=async function()
{
    const user=this
    const token=await jwt.sign({_id:user._id},'node_restapi')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON=function()
{
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject

}

const User=mongoose.model('User',userSchema)
module.exports=User