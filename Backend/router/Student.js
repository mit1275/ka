const express = require("express");
const expressAsynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Student = require("../model/Student");
const jwt = require("jsonwebtoken");
const generate = require("../utils/generatetokens");
const studentRoute = express.Router();
const fast2sms = require('fast-two-sms')



const m="1239";
studentRoute.post("/verifys",expressAsynchandler(async(req,res)=>{
   
  console.log(req.body.number);
  const response =await fast2sms.sendMessage({authorization:process.env.PHONE_SECRET,message:"1234",numbers:[req.body.number]});
  console.log(response);
  res.send(response);
}));


studentRoute.post("/checkotp",expressAsynchandler(async(req,res)=>{
   
  console.log(req.body.otp);


  if(m===req.body.otp)
  {
    console.log("otp verified");
  }
  else{
    console.log("wrong otp");
  }

  
}));
studentRoute.post(
  "/signin",
  expressAsynchandler(async (req, res) => {
    let token;
    console.log(req.body.email);
    if (!req.body.email) {
      return res.send({ message: "Please Enter email id" });
    } else if (!req.body.password) {
      return res.send({ message: "Please enter password" });
    }
    // console.log("Request");
    const student = await Student.findOne({ email: req.body.email });

    console.log(req.body.email + " wants to sign in ");

    if (student) {
      console.log(req.body.email + " signin found in database");

      if (bcrypt.compareSync(req.body.password, student.password)) {
        return res.send({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          token:generate(student._id),
          message: "Success",
        });
      } else {
        console.log("Invalid Password");
        res.send({
          message: "Invalid email or password",
        });
        // window.location.reload();
      }
    } else {
      console.log("Invalid Email");
      res.send({
        message: "Invalid email or password",
      });
      // window.location.reload();
    }
  })
);

studentRoute.post("/verify",expressAsynchandler(async(req,res)=>{
   
  // console.log(req.body.email);
  console.log(req.body.id);
  console.log(req.body.data);
     if(!req.body.id)
     {
        console.log("Invalid ad");
        return res.status(401).send({

          message:"Invalid Ad"
        })
     };

     if(!req.body.data)
     {
       console.log("Not verifed yet");
       return res.status(401).send({

        message:"Not verifed yet"
      });

     }

    //  console.log(req.body.id);
    //  console.log(req.body.data);
    

     const user=await Student.findOne({email:req.body.email});

     if(user)
     {
       console.log(user);

      // const ui=await user.findOne()
      var erer=0;

      const erer1=await  Student.update(
       
        { _id:user._id, "adinfo._id":req.body.id.toString() },
        {
            $set: {
                "adinfo.$.data": req.body.data,
             }
        }
    );
   
      

     

      

    if(erer1)
    {
      console.log("Data updated");

      return res.status(201).send({

        message:"Data Updated"
      })
    }
    else{
      console.log("Data updation fail");

      return res.status(401).send({

        message:"Data updation fail"
      })
    }


     }
    
}));

studentRoute.post("/allads",expressAsynchandler(async (req, res)=> {

  // Student.find({adinfo})
  const wer=await Student.find({});
  var arr=[];
  if(wer)
  {
    console.log(wer.length);
    for(let i=0;i<wer.length;i++)
    {
        var brr=wer[i].adinfo;
        for(let j=0;j<brr.length;j++)
        {
          arr.push(brr[j]);
        }
      
      
    }
  }
  Student.find({},(err, files) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    console.log(arr);
    return res.json({files:arr});
  });
}));


studentRoute.post(
  "/putad",
  expressAsynchandler(async (req, res) => {
    let token;
    console.log(req.body.email);
    if (!req.body.email) {
      return res.send({ message: "Please Enter email id" });
    } else if (!req.body.firstName) {
      return res.send({ message: "Please enter title" });
    }
    else if(!req.body.budget)
    {
      return res.send({ message: "Please enter budget" })
    }
    else if(!req.body.Link)
    {
      return res.send({ message: "Please enter link" })
    }
    
    // console.log("Request");
    const student = await Student.findOne({ email: req.body.email });

    console.log(req.body.email + " wants to put ad ");

    if (student) {
      console.log(req.body.email + " signin found in database");

     console.log(student._id);
        

    
      const etr=await Student.updateOne({
        _id:student._id
    },{
          $addToSet:{
            adinfo:{
              title:req.body.firstName,
              budget:req.body.budget,
              description:req.body.description,
              Link:req.body.Link,
              email:req.body.email
            },
          },
    });
    console.log(etr);
      console.log(req.body.email + " record saved");

      res.status(200).send({
        message: "Success",
      });
      
    } else {
      console.log("Invalid Email");
      res.send({
        message: "Invalid email",
      });
      // window.location.reload();
    }
  })
);


studentRoute.post(
  "/signup",
  expressAsynchandler(async (req, res) => {
    console.log(req.body.email + " requested to register");

    const student = await Student.findOne({ email: req.body.email });

    if (student) {
      console.log(req.body.email + " already registered ");
      res.send({
        message: "Email Already Registered",
      });
    } else {
     

      const user = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        contactNo: req.body.contactNo,
        // token:generate(user._id),
      });

      console.log(user.firstName);
      console.log(user.email);
      console.log(user.lastName);
      console.log(user.password);
      console.log(user.contactNo);

      const creatstudent = await user.save();

      console.log(req.body.email + " student created");

      res.status(200).send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNo: user.contactNo,
        token:generate(user._id),
        message: "Success",
      });
    }
  })
);

studentRoute.get(
  "/:id",
  expressAsynchandler(async (req, res) => {
    const sellerId = req.params.id;
    try {
      const seller = await Student.findOne({ _id: sellerId });
      if (seller) {
        return res.status(200).send({
          message: "Success",
          seller: seller,
        });
      }
      return res
        .status(400)
        .send({ message: "Could not find the requested resource" });
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Could not find the requested resource" });
    }
  })
);

module.exports = studentRoute;
