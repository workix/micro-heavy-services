import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { mailer } from './factory/mailer';
import RabbitmqServer from './factory/rabbitmq_server'
import { findExpiredProcesses } from './jobs/selectiveProcesses';

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

  const cron = require('node-cron');

  cron.schedule("* * * * * *", findExpiredProcesses);

  const port = process.env.PORT || 4001;

  const sendMail = async (req, res) => {
    try {
      const { subject, text, html } = req.body
      if (subject == null) {
        throw new Error('Subject not defined')
      } else if (text == null) {
        throw new Error('Text not defined')
      } else if (html == null) {
        throw new Error('Html not defined')
      }
      const options = { subject: subject, text: text, html: html }

      const info = await mailer(options)
      res.status(200).send({ "success": true, "msg": `${info.response}` })
    } catch (error) {
      console.error(error)
      res.status(400).send({ "msg": error.message, "success": false })
    }
  }


  app.get('/welcome', (req, res, next) => {
    res.status(200).send({ message: 'Welcome' })
  });

  app.post('/welcome', (req, res, next) => {
    res.status(200).send(req.body)
  });

  app.post('/send_mail', sendMail)

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
