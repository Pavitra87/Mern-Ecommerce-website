const mongoose = require('mongoose')

const User = mongoose.Schema({
username:{
    type:String,

},
email:{
    type:String,
    unique:true,
},
password:{
    type:String,
},
cartData:{
    type:Object
},
date:{
    type:Date,
    dafault:Date.now,
}
})

const Usermodel = mongoose.model('User', User)
module.exports = Usermodel;