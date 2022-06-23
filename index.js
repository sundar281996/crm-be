// const express = require('express')
import express from "express";
import { MongoClient } from "mongodb";
import {userRouter} from "./newFile.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express()

app.use(cors());

app.use('/users',userRouter)
app.use(express.json())
dotenv.config()


app.get('/',(request,response)=>{
    response.send({msg:'Password'})
});



// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

// Node - MongoDB
async function createConnection()
{
    const client=await new MongoClient(MONGO_URL)
    await client.connect();
    console.log('MongoDb Connected');
    return client;
}

export const client=await createConnection();



app.listen(4000)