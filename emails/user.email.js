import nodemailer from 'nodemailer'

export const sendEmail = async (email, subject, message) => {
    // console.log(email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SenderEmail,
            pass: process.env.SenderPassword
        }
    })

    const info = await transporter.sendMail({
        from: `route Academy <${process.env.SenderEmail}> `,
        to: email,
        subject: subject,
        html: message
    })

    // console.log(info);


}