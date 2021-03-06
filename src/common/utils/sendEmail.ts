import * as nodemailer from 'nodemailer';
import { EmailOptionsType } from '../types/email-options.type';

const sendEmail = async (options: EmailOptionsType) => {
  const transporter = nodemailer.createTransport({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
