import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

import RabbitmqServer from './factory/rabbitmq_server'
import { findExpiredProcesses } from './jobs/selectiveProcesses';
import router from './routes/default';

const cron = require('node-cron');


(async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static('public'));

  process.on('uncaughtException', function (error) {
    console.log(error.stack);
    console.log("uncaughtException Node NOT Exiting...");
  });

  

  cron.schedule("* */30 * * * *", findExpiredProcesses);

  const port = process.env.PORT || 4001;

  app.use(router)

  app.listen(port, async () => {
    console.log(`Server started at port ${port}`);
    await consumer();
  });

  const consumer = async () => {
    const server = new RabbitmqServer(process.env.RABBITMQ_SERVER_HOST);
    await server.start();
    await server.consume('notifications', (message) => console.log(message.content.toString()));
  }



})();
