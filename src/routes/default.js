
import { sendMail } from '../controllers/default';

const express = require('express');
const router = express.Router();



router.get('/welcome', (req, res) => {
    res.status(200).send({ message: 'Welcome' })
});

router.post('/welcome', (req, res) => {
    res.status(200).send(req.body)
});



router.post('/send_mail', sendMail)

export default router;