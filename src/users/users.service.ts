import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './model/user.model';
import { CreateUserInput } from './dto/input/create-user.input';
import { registerPhoneAndEmailConfirmation } from '../common/services/confirmationToken';
import { UpdateUserInput } from './dto/input/update-user.input';
import { UpdatePasswordInput } from './dto/input/update-password.input';
import { ForgotPasswordInput } from './dto/input/forgot-password.input';
import { PasswordResetToken } from '../auth/model/password-reset-token';
import { ResetTokenInput } from './dto/input/reset-token.input';
import { ResetPassword } from './dto/input/reset-password.input';
import { ConfirmTokenInput } from '../auth/dto/input/confirm-token.input';
import { uploadImage } from '../common/utils/image-upload';
import { usersFolder } from '../common/constants/folders';
import { ReadStream } from 'fs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const checkEmail = await this.userModel.findOne({
      where: {
        email: input.email,
      },
    });

    if (checkEmail) {
      throw new BadRequestException(`User with email ${input.email} exists`);
    }

    const checkUsername = await this.userModel.findOne({
      where: {
        username: input.username,
      },
    });

    if (checkUsername) {
      throw new BadRequestException(
        `Username ${input.username} is not available.`,
      );
    }

    const user = new User();
    user.username = input.username;
    user.firstName = input.firstName;
    user.lastName = input.lastName;
    user.email = input.email;
    user.phone = input.phone;
    user.password = input.password;

    // generate phone and email token
    const { emailToken, phoneToken } = user.generateConfirmationToken();

    await user.save();

    await registerPhoneAndEmailConfirmation(user, emailToken, phoneToken);

    return user;
  }

  async updateUserDetails(
    userId: string,
    input: UpdateUserInput,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    await user.update(input);

    await user.reload();

    return user;
  }

  async updatePassword(
    userId: string,
    input: UpdatePasswordInput,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (!(await user.matchPassword(input.currentPassword))) {
      throw new BadRequestException(`Password is incorrect`);
    }

    await user.update({
      password: input.newPassword,
    });

    await user.reload();

    return user;
  }

  async forgotPassword({
    email,
  }: ForgotPasswordInput): Promise<PasswordResetToken> {
    const user = await this.getUserByEmail(email);

    const token = user.generatePasswordResetToken();

    await user.save();

    await user.reload();

    return { token, user };
  }

  async checkResetPasswordToken({ token }: ResetTokenInput): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpire: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException(`Invalid token`);
    }

    return user;
  }

  async resetPassword(
    userId: string,
    { password }: ResetPassword,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    await user.update({
      password,
    });

    await user.reload();

    return user;
  }

  async confirmEmail({ token }: ConfirmTokenInput): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        confirmEmailToken: token,
        isEmailConfirmed: false,
      },
    });

    if (!user) {
      throw new BadRequestException(`Invalid token`);
    }

    await user.update({
      confirmEmailToken: undefined,
      isEmailConfirmed: true,
    });

    await user.reload();

    return user;
  }

  async confirmPhone({ token }: ConfirmTokenInput): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        confirmPhoneToken: token,
        isPhoneConfirmed: false,
      },
    });

    if (!user) {
      throw new BadRequestException(`Invalid token`);
    }

    await user.update({
      confirmPhoneToken: undefined,
      isPhoneConfirmed: true,
    });

    await user.reload();

    return user;
  }

  async uploadPhoto(
    userId: string,
    filename: string,
    readStream: ReadStream,
  ): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const imageUrl = await uploadImage(filename, readStream, usersFolder);

    await user.update({
      image: imageUrl,
    });

    await user.reload();

    return user;
  }

  async updatePhoto(userId: string, image: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await user.update({
      image,
    });

    await user.reload();

    return user;
  }
}
