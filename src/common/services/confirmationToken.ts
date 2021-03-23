import sendEmail from '../utils/sendEmail';
import sendSMS from '../utils/sendSms';
import { User } from '../../users/model/user.model';

export const registerPhoneAndEmailConfirmation = async (
  user: User,
  emailToken: string,
  phoneToken: string,
) => {
  // email message
  const emailMessage = `
        You are receiving this email because you need to confirm your email address.
        Your registration token is ${emailToken}
        `;

  // phone message
  const phoneMessage = `Your verification code is ${phoneToken}`;

  // confirm email
  await sendEmail({
    email: user.email,
    subject: 'Email confirmation token',
    message: emailMessage,
  });

  // confirm phone
  // await sendSMS(user.phone.toString(), phoneMessage);
};
