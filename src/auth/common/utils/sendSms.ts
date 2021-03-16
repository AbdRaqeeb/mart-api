import { Client } from 'africastalking-ts';

const client = new Client({
  apiKey: process.env.SMS_API_KEY,
  username: process.env.SMS_API_USERNAME,
});

const sendSMS = async (phone: string, message: string) => {
  await client.sendSms({
    to: [phone],
    message: message,
    from: process.env.SMS_FROM_NAME,
  });
};

export default sendSMS;
