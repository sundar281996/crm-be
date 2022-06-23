import {
    getuser,
    passwordGenerator,
    createuser,
    passwordUpdate,
    updateuser,
    getemployee,
    createemployee,
    employeepasswordUpdate,
    updateemployee
  } from "./DbQueries.js";
  import bcrypt from "bcrypt";
  import express from "express";
  import jwt from "jsonwebtoken";
  import nodemailer from "nodemailer";
  import dotenv from "dotenv";
  import {auth} from "./token.js";
  dotenv.config();
  const router = express.Router();
  
  
  // User Login
  router.route("/signup").post(async (request, response) => {
    const { Firstname, Lastname, Mailid, Password } = request.body;
  
    const data = await getuser({ Mailid });
    // console.log(data);
    if (data) {
      return response.status(400).send({ msg: "Mailid already exists" });
    }
    if (Password.length < 8) {
      return response.status(400).send({ msg: "Password must be longer" });
    }
  
    const hashedPassword = await passwordGenerator(Password);
    const createData = await createuser({
      Firstname,
      Lastname,
      Mailid,
      Password: hashedPassword,
    });
    const result = await getuser({ Mailid });
    response.send(result);
  });
  
  router.route("/login").post(async (request, response) => {
      const { Mailid, Password } = request.body;
      const data = await getuser({ Mailid });
    
      if (!data) {
        return response
          .status(400)
          .send({ msg: "Invalid login credentials : mailid" });
      }
    
      const dbPassword = data.Password;
      const passwordMatch = await bcrypt.compare(Password, dbPassword);
    
      if (passwordMatch) {
        const token = jwt.sign({ id: data._id }, process.env.key);
        // console.log(token);
        return response.send({ msg: "Login successful", token });
      } else {
        return response
          .status(400)
          .send({ msg: "Invalid login credentials : Password" });
      }
    });
    
  router.route("/forgotpassword").post(async (request, response) => {
    const { Mailid } = request.body;
    let data = await getuser({ Mailid });
  
    if (!data) {
      return response
        .status(400)
        .send({ msg: "Invalid login credentials : mailid" });
    }
    const token = jwt.sign({ id: data._id }, process.env.key);
    const link = `https://crm-application.netlify.app/forgotpassword/verify/${token}`;
    const replacePassword = await passwordUpdate({ Mailid, token });
    // console.log(replacePassword);
    let updatedResult = await getuser({ Mailid });
    // console.log(updatedResult);
  
    // mail
    Mail(link,Mailid);
  
    return response.send({ updatedResult, token });
  });
  
  router.route("/forgotpassword/verify").get(async (request, response) => {
    // const {id:token}=request.params
  
    const token = await request.header("x-auth-token");
    const tokenVerify = await getuser({ Password: token });
    console.log(tokenVerify, "tokenverified");
    if (!tokenVerify) {
      return response.status(400).send({ msg: "Invalid Credentials" });
    } else {
      return response.send({ msg: "Matched" });
    }
  });
  
  router.route("/updatepassword").post(async (request, response) => {
    const { Password, token } = request.body;
    const data = await getuser({ Password: token });
    const { Mailid } = data;
    console.log(Mailid);
    if (Password.length < 8) {
      return response.status(401).send("Password Must be longer");
    }
    const hashedPassword = await passwordGenerator(Password);
  
    const passwordUpdate = await updateuser({ Mailid, Password: hashedPassword });
    const result = await getuser({ Mailid });
  
    return response.send(result);
  });
  
  
  
  // Employee Login
  
  router.route("/employeesignup").post(async (request, response) => {
      const { Firstname, Lastname, Mailid, Password, Designation } = request.body;
    
      let data = await getemployee({  Mailid });
        //   data= await getuser({  Mailid });
      // console.log(data);
      if (data) {
        return response.status(400).send({ msg: "Mailid already exists" });
      }
      if (Password.length < 8) {
        return response.status(400).send({ msg: "Password must be longer" });
      }
    
      const hashedPassword = await passwordGenerator(Password);
      const createData = await createemployee({
        Firstname,
        Lastname,
        Mailid,
        Password: hashedPassword,Designation
      });
      const result = await getemployee({ Mailid });
      response.send(result);
    });
    
    
    
    
    
    router.route("/employeelogin").post(async (request, response) => {
      const { Mailid, Password,Designation } = request.body;
      const data = await getemployee({ Mailid,Designation });
    
      if (!data) {
        return response
          .status(400)
          .send({ msg: "Invalid login credentials : mailid" });
      }
    
      const dbPassword = data.Password;
      const passwordMatch = await bcrypt.compare(Password, dbPassword);
    
      if (passwordMatch) {
        const token = jwt.sign({ id: data._id }, process.env.key);
        // console.log(token);
        return response.send({ msg: "Login successful", token });
      } else {
        return response
          .status(400)
          .send({ msg: "Invalid login credentials : Password" });
      }
    });
    
    
    
  
  router.route("/employeeforgotpassword").post(async (request, response) => {
      const { Mailid } = request.body;
      let data = await getemployee({ Mailid });
    
      if (!data) {
        return response
          .status(400)
          .send({ msg: "Invalid login credentials : mailid" });
      }
      const token = jwt.sign({ id: data._id }, process.env.key);
      const link = `https://crm-application.netlify.app/employeeforgotpassword/verify/${token}`;
      const replacePassword = await employeepasswordUpdate({ Mailid, token });
      let updatedResult = await getemployee({ Mailid });
    
    
      // mail
      Mail(link,Mailid);
    
      return response.send({ updatedResult, token });
    });
    
    
    router.route("/employeeforgotpassword/verify").get(async (request, response) => {
      // const {id:token}=request.params
    
      const token = await request.header("x-auth-token");
      const tokenVerify = await getemployee({ Password: token });
      console.log(tokenVerify, "tokenverified");
      if (!tokenVerify) {
        return response.status(400).send({ msg: "Invalid Credentials" });
      } else {
        return response.send({ msg: "Matched" });
      }
    });
  
  
  
    router.route("/employeeupdatepassword")
      .post(async (request, response) => {
      const { Password, token } = request.body;
      const data = await getemployee({ Password: token });
      const { Mailid } = data;
      console.log(Mailid);
      if (Password.length < 8) {
        return response.status(401).send("Password Must be longer");
      }
      const hashedPassword = await passwordGenerator(Password);
    
      const passwordUpdate = await updateemployee({ Mailid, Password: hashedPassword });
      const result = await getemployee({ Mailid });
    
      return response.send(result);
    });
    
  
    router.route("/getuserdata")
    .get(auth,async(request,response)=>{
        let result =await getuser()
        response.send(result)
  
    })
  
  
  
  function Mail(link,Mailid) {
      const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user:process.env.email,
              pass:process.env.password,
          },
      });
     console.log(Mailid);
      const mailOptions = {
          from:process.env.email,
          to:Mailid,
          subject: "Mail from the CRM Application",
          html: `<a href=${link}>Click the link to reset the password</a>`,
      };
  
      transport.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.log("err");
          } else {
              console.log("status", info.response);
          }
      });
  }
  
  export const userRouter = router;