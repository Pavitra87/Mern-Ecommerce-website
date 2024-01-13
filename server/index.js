const express = require('express')
const app = express();
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv');
const connectedDB = require('./db/db');
const Productmodel = require('./model/productModel')
const Usermodel = require('./model/userModel')


const PORT = 4000;
dotenv.config()
app.use(express.json())
app.use(cors())

connectedDB();

// app.use('/api',require('./router/productRouter'))

//image storage
const storge = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()} ${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storge })

app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

//add product
app.post('/addproduct', async (req, res) => {
    let products = await Productmodel.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Productmodel({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    })
    console.log(product)
    await product.save();
    res.json({
        success: true,
        name: req.body.name
    })
})

//delete product
app.post('/removeproduct', async (req, res) => {
    await Productmodel.findOneAndDelete({ id: req.body.id })
    res.json({
        success: true,
        name: req.body.name
    })
})

//getting all product
app.get('/allproducts', async (req, res) => {
    let products = await Productmodel.find({})
    res.send(products)
})

//register user
app.post('/signup', async (req, res) => {
    let check = await Usermodel.findOne({ email: req.body.email })
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Usermodel({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom')
    res.json({ success: true, token })
})

//login user
app.post('/login', async (req, res) => {
    let user = await Usermodel.findOne({ email: req.body.email });

    if (user) {
        const passwordCompare = req.body.password === user.password;

        if (passwordCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, errors: "wrong password" })
        }
    }
    else {
        res.json({ success: false, errors: "wrong email id" })
    }
})

//newcollection data
app.get('/newcollection',async(req,res)=>{
    let products=await Productmodel.find({});
    let newcollection=products.slice(1).slice(-8);
    res.send(newcollection)
})

//popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products=await Productmodel.find({category:"women"});
    let popularWomen=products.slice(0,4);
    res.send(popularWomen);
})

//creating middleware
const fetchUser=async(req,res,next)=>{
  const token=req.header('auth-token')
  if(!token){
    res.status(401).send({errors:"Please authenticateusing valid token"})
  }else{
    try {
        const data=jwt.verify(token,'secret_ecom');
        req.user=data.user;
        next()
    } catch (error) {
        res.status(401).send({errors:"please authenticate using valid token"})
        console.log(error)
    }
  }
}

//add product cart
app.post('/addtocart',fetchUser,async(req,res)=>{
 let userData=await Usermodel.findOne({_id:req.user.id});
 userData.cartData[req.body.itemId] +=1;
 await Usermodel.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
 res.send("Added")
})

//remove product cart
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userData=await Usermodel.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId>0])
 userData.cartData[req.body.itemId] -=1;
 await Usermodel.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
 res.send("removed")
})

//getcart data
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData=await Usermodel.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


app.listen(PORT, () => {
    console.log(`server running ${PORT} `)
})


