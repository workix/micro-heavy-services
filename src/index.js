import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { mailer } from './factory/mailer';
import RabbitmqServer from './factory/rabbitmq_server'
import { findExpiredProcesses } from './jobs/selectiveProcesses';

const fs = require('fs');
const path = require('path');



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

  cron.schedule("* */30 * * * *", findExpiredProcesses);

  const port = process.env.PORT || 4001;

  const sendMail = async (req, res) => {
    try {
      let { subject, text, html, to, template, replacements } = req.body
      if (subject == null) {
        throw new Error('Subject not defined')
      } else if (template == null && text == null) {
        throw new Error('Text not defined')
      } else if (template == null && html == null) {
        throw new Error('Html not defined')
      } else if (to == null) {
        throw new Error('To not defined')
      } else if (template && replacements == null) {
        throw new Error('Replacements not defined')
      }

      if (template && replacements) {
        let htmlTemplate, textTemplate;
        switch (template) {
          case "welcome":
            htmlTemplate = fs.readFileSync(path.resolve(__dirname, '../', 'public', 'mail', 'email_template_welcome.html'), 'utf8');
            textTemplate = `Olá {{username}},

        Obrigado por fazer cadastro conosco !
        
        Seu usuário está pronto. Aproveite nossos serviços !
        Usuário: {{username}}
        Obrigado,
        Workix - Plataforma de Empregos Totalmente Grátis`
            break;
          default:
            throw new Error('Template is not defined')
        }

        replacements.forEach(r => {
          textTemplate = textTemplate.replaceAll(`{{${r.key}}}`, r.value)
          htmlTemplate = htmlTemplate.replaceAll(`{{${r.key}}}`, r.value)
        });

        text = textTemplate
        html = htmlTemplate
      }
      const options = { subject, text, html, to }

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
