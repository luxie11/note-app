const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'lukasmatju19@gmail.com',
        subject: 'Thanks for joining in!',
        text:  `Welcome to the app, ${name}.`
    })
}

const sendCancelationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'lukasmatju19@gmail.com',
        subject: 'Sorry to see you go',
        text:  `Goodbye ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}