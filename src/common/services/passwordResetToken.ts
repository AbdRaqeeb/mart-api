import sendEmail from '../utils/sendEmail';
import { User } from '../../users/model/user.model';
import { InternalServerErrorException } from '@nestjs/common';

export const passwordResetToken = async (
  token: string,
  user: User,
): Promise<void> => {
  try {
    const message = `
        Hi ${user.firstName},
        
        You are receiving this email because you request to reset your password.
        Your password reset token is ${token}.
        If you did not request a new password, please ignore this email.
        
        Best Regards,
        Mart.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Mart - Reset your password',
      message,
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw new InternalServerErrorException(`Email could not be sent`);
  }
};
