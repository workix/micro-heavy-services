import { mailer } from "../factory/mailer"
import { sendPush } from "../factory/push"

export const sendWelcome = async user => {
    const subject = "Bem vindo(a)"
    if (user.firebaseMessageToken) {
        let shortTextTemplate = `Olá {{username}},
        Obrigado por fazer cadastro conosco !        
        Seu usuário está pronto. Aproveite nossos serviços !`
        shortTextTemplate = shortTextTemplate.replaceAll("{{username}}", user.email)
        await sendPush(user.firebaseMessageToken, shortTextTemplate, subject )
    }

    let htmlTemplate = fs.readFileSync(path.resolve(__dirname, '../', '../', 'public', 'mail', 'email_template_welcome.html'), 'utf8');
    let textTemplate = `Olá {{username}},

        Obrigado por fazer cadastro conosco !
        
        Seu usuário está pronto. Aproveite nossos serviços !
        Usuário: {{username}}
        Obrigado,
        Workix - Plataforma de Empregos Totalmente Grátis`

        htmlTemplate = htmlTemplate.replaceAll("{{username}}", user.email)
        textTemplate = textTemplate.replaceAll("{{username}}", user.email)

        const options = { subject, text: textTemplate, html: htmlTemplate, to: user.email }

        await mailer(options)

}
