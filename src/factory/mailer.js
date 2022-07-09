const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    }
});

const defaultOptions = {
    from: '"Felipe R M" <ahfeeeh@gmail.com>', // sender address    
};

export const mailer = options => {
    return new Promise((resolve, reject) => {
        const mailOptions = { ...defaultOptions, ...options }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {                
                reject(error);
            } else {                
                resolve(info);
            }
        })
    })
}

