import bcrypt from "bcrypt";
import { client } from "./index.js";


async function passwordGenerator(Password) {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(Password, salt);
    // console.log(hashedPassword);
    return hashedPassword;
}
async function getuser(userdata) {
    let result = await client.db('movielist').collection('users').findOne( userdata );
    return result;
}
async function createuser(data) {
    return await client.db('movielist').collection('users').insertOne(data);
}

async function passwordUpdate(userdata)
{
    let {Mailid,token}=userdata
    // console.log(userdata);
    console.log(token,"token");

    let result=await client.db('movielist').collection('users').updateOne({Mailid},{$set:{Password:token}})
    return result
}


async function updateuser(userdata)
{
    const{Mailid,Password}=userdata
    let result=await client.db('movielist').collection('users').updateOne({Mailid},{$set:{Password:Password}})
    return result;
}

async function createemployee(userdata)
{
    const { Firstname,Lastname,Mailid,Password,Designation }=userdata
    return await client.db('movielist').collection('employees').insertOne(userdata);
}
async function getemployee(userdata) {
    let result = await client.db('movielist').collection('employees').findOne( userdata );
    return result;
}


async function employeepasswordUpdate(userdata)
{
    let {Mailid,token}=userdata
    // console.log(userdata);
    console.log(token,"token");

    let result=await client.db('movielist').collection('employees').updateOne({Mailid},{$set:{Password:token}})
    return result
}


async function updateemployee(userdata)
{
    const{Mailid,Password}=userdata
    let result=await client.db('movielist').collection('employees').updateOne({Mailid},{$set:{Password:Password}})
    return result;
}

export
   {passwordGenerator,
    getuser,
   createuser,
   passwordUpdate,
   updateuser,
   getemployee,
   createemployee,
   employeepasswordUpdate,
   updateemployee
}