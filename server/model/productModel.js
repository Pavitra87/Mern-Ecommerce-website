const mongoose = require('mongoose')

const Product = mongoose.Schema({
    id: {
        type: Number,
        // required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true,
    },
    Date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true
    }

})

const Productmodel = mongoose.model('Product', Product)
module.exports = Productmodel;