import express, { application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {router} from './src/routes/Routes.js';
import  bodyParser from 'body-parser';
import { Ping } from './src/pingSched/Pinger.js';

dotenv.config() // Configure .Env File

const app = express()
const port = 3000;
app.use(bodyParser.json());
app.use(router);

const start = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI);
    Ping()
    app.listen(port, () => {
        console.log("Server is running");
    })
}

///////////////////// Make Each Controller as a CLASS////////////////
start()

//This is how to Scheudle a Polling request every minute without configs
// We can get response time by calculating Time with Date object (Check mark)

/*
cron.schedule('* * * * *',() => {axios.get('http://www.google.com/')
  .then((response) => {
    console.log("RESPONSE 2", response)
  })
  .catch((error) => {
    console.log(error.response.status);
  });
})
*/