import { Client } from 'africastalking-ts';
import 'dotenv/config';

const client = new Client({
  apiKey: process.env.SMS_API_KEY,
  username: process.env.SMS_API_USERNAME,
});

const sendSMS = async (phone: string, message: string) => {
  await client.sendSms({
    to: [phone.toString()],
    message: message,
    from: process.env.SMS_FROM_NAME,
  });
};

export default sendSMS;
