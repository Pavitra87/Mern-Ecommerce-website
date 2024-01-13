const mongoose=require('mongoose')

const connectedDB=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL) 
        console.log("MongoDb connected!")
    } catch (error) {
        console.log(error)
    }
    
}
module.exports=connectedDB