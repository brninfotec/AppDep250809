const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

  let app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use('/profilePics', express.static('profilePics'));

  const path = require("path");

app.use(express.static(path.join(__dirname, "./client/build")));


app.use((req, res) => {
  res.sendFile(
    path.resolve(__dirname, "client", "build", "index.html")
  );
});

// PORT (Render safe)
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

  const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, 'profilePics')
  },

  filename: function (req, file, cb) {
    cb(null,`${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage });

app.post("/validateToken",upload.none(),async(req,res)=>{
   console.log(req.body);

    let decryptedCredintials = jwt.verify(req.body.token,"brn");

    console.log(decryptedCredintials)

  let userArr = await user.find().and([{ email:decryptedCredintials.email}]);


  if(userArr.length > 0){
    if(decryptedCredintials.password === userArr[0].password){
      let dataToSend ={
        firstName:userArr[0].firstName,
        lastName:userArr[0].lastName,
        email:userArr[0].email,
        age:userArr[0].age,
        mobileNo:userArr[0].mobileNo,
        profilePic:userArr[0].profilePic,
       
      }
    res.json({status:"Success",msg:"credintials are correct",data:dataToSend})
    }else{
   res.json({status:"Failure",msg:"Invalid Password"})
    }

  }else{
   res.json({status:"Failure",msg:"user doesn't exist"})
  }
})

app.post("/login",upload.none(),async(req,res)=>{
   console.log(req.body);
  let userArr = await user.find().and([{ email:req.body.email}]);
 
  let token = jwt.sign({email:req.body.email,password:req.body.password},"brn");

  let isValidPassword = await bcrypt.compare(req.body.password,userArr[0].password);

  if(userArr.length > 0){
    if(isValidPassword === true){
      let dataToSend ={
        firstName:userArr[0].firstName,
        lastName:userArr[0].lastName,
        email:userArr[0].email,
        age:userArr[0].age,
        mobileNo:userArr[0].mobileNo,
        profilePic:userArr[0].profilePic,
        token:token
      }
    res.json({status:"Success",msg:"credintials are correct",data:dataToSend})
    }else{
   res.json({status:"Failure",msg:"Invalid Password"})
    }

  }else{
   res.json({status:"Failure",msg:"user doesn't exist"})
  }
})

 app.post("/signup",upload.single("profilePic"),async(req,res)=>{

    console.log(req.body);
    console.log(req.file);
     let hashedPassword = await bcrypt.hash(req.body.password,10);
    try{
     let users = new user({
        firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    password:hashedPassword,
    age:req.body.age,
    mobileNo:req.body.mobileNo,
    profilePic:req.file.path
    });
    await user.insertMany([users]);
    console.log("inserted Successfully");
    res.json({status:"Success",msg:"Account created Successfully"})
    }catch(err){
     console.log("Unable to insert");
     res.json({status:"Failure",msg:"Unable to  create "})
    }
  })

  app.patch("/updateProfile",upload.single("profilePic"),async (req,res)=>{
    console.log(req.body);
    try{
    if(req.body.firstName.trim().length > 0){
    await user.updateMany({email:req.body.email},{firstName:req.body.firstName})
    }

    if(req.body.lastName.trim().length > 0){
    await user.updateMany({email:req.body.email},{lastName:req.body.lastName})
    }

   if(req.body.password.trim().length > 0){
    await user.updateMany({email:req.body.email},{password:req.body.password})
    }

    if(req.body.age > 0){
    await user.updateMany({email:req.body.email},{age:req.body.age})
    }
    if(req.body.mobileNo > 0){
    await user.updateMany({email:req.body.email},{mobileNo:req.body.mobileNo})
    }
    if(req.file){
    await user.updateMany({email:req.body.email},{profilePic:req.file.path})
    }
    res.json({status:"Success",msg:"User updated Successfully"})
  }catch(err){
  res.json({status:"Failure",msg:"nothing is updated"})
  }
  })

  app.delete("/deleteProfile",upload.none(),async(req,res)=>{
   let delCount = await user.deleteMany({email:req.body.email});
    if(delCount.deletedCount > 0){
    res.json({status:"Success",msg:"Account deleted successfully"})
    }else{
   res.json({status:"Failure",msg:"nothing is deleted"})
    }
  })

  // app.listen(process.env.PORT,()=>{
  //   console.log(`Listening to port ${process.env.PORT}`)
  // })

let userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    age:Number,
    mobileNo:Number,
    profilePic:String
});

  let user = new mongoose.model("users",userSchema,"250809Post");

let connectedToMDB = async()=>{
     try{
    await mongoose.connect(process.env.MDBURL);
    console.log("Successfully Connected to MDB");
   
    }catch(err){
    console.log("Unable to connected to MDB")
    }
}

connectedToMDB();