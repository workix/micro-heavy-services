import { mailer } from '../factory/mailer';
const fs = require('fs');
const path = require('path');

export const sendMail = async (req, res) => {
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
                    htmlTemplate = fs.readFileSync(path.resolve(__dirname, '../', '../', 'public', 'mail', 'email_template_welcome.html'), 'utf8');
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