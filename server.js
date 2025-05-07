const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const Bcrypts = require('bcrypt')
const app = express();
// const PORT = process.env.PORT || 2025;
const PORT = process.env.PORT || 2025;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect("mongodb+srv://Sweety:spani99@cluster0.pk8r1.mongodb.net/logindatas?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const LoginSchema = new mongoose.Schema({
    username: String,
    useremail: String,
    userpassword: String
    // userconfirmpassword: String
})

const loginModel = mongoose.model("allusers", LoginSchema)
// app.get("/login", (req, res)=>{
//     console.log(req.body)
// })
app.post("/login", (req, res)=>{
    console.log(req.body)
    
    const loginDetails = req.body
    const hashedPswd = Bcrypts.hash(loginDetails.userpassword, 6);
    
    const userData = new loginModel({
    username: loginDetails.username,
    useremail: loginDetails.useremail,
    userpassword: loginDetails.userpassword,
    // userpassword: hashedPswd
    // userconfirmpassword: loginDetails.userconfirmpassword
    })
    
    if (loginDetails.userpassword ==  loginDetails.userconfirmpassword) {
     userData.save()
     res.json({"msg":"Successfully registered"})
    }
    else{
      // res.send("Password is not matching")
      res.json({"msg":"Passwords not matching"})
    }
})

app.post('/signin', async (req,res) => {
  // console.log(req.body)
  const signInDetails = req.body
  const outputs = await loginModel.findOne({username: signInDetails.username})
  console.log(outputs)
  if (outputs != null) {
    const actualPswd = outputs.userpassword
    const enteredPswd = signInDetails.userpassword
    if (enteredPswd == actualPswd) {
      res.json({"msg": "Login successful"})
    }
    else{
      res.json({"msg": "Login failure"})
    }
  //  const resultant = await Bcrypts.compare(enteredPswd, actualPswd)
  //  console.log(resultant)
  }
  else{
    res.json({"msg": "Login invalid ,Details not found"})
  }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
