import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserToken } from './model/user-token';
import { CreateUserInput } from '../users/dto/input/create-user.input';
import { JwtDto } from './dto/jwt.dto';
import { User } from '../users/model/user.model';
import { UserDTO } from '../users/dto/user.dto';
import { LoginUserInput } from '../users/dto/input/login-user.input';
import { UpdateUserInput } from '../users/dto/input/update-user.input';
import { UpdatePasswordInput } from '../users/dto/input/update-password.input';
import { ForgotPasswordInput } from '../users/dto/input/forgot-password.input';
import { passwordResetToken } from './common/services/passwordResetToken';
import { ResetTokenInput } from '../users/dto/input/reset-token.input';
import { ResetPassword } from '../users/dto/input/reset-password.input';
import { ConfirmTokenInput } from './dto/input/confirm-token.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async registerUser(input: CreateUserInput): Promise<UserToken> {
    const user = await this.usersService.createUser(input);

    return this.sendTokenResponse(user);
  }

  async loginUser({ user, password }: LoginUserInput): Promise<UserToken> {
    const foundUser =
      (await this.usersService.getUserByEmail(user)) ||
      (await this.usersService.getUserByUsername(user));

    if (!foundUser) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const isMatch = await foundUser.matchPassword(password);

    if (!isMatch) {
      throw new BadRequestException(`Invalid credentials`);
    }

    return this.sendTokenResponse(foundUser);
  }

  async validateUser(id: string): Promise<UserDTO> {
    return this.usersService.getUserById(id);
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<UserDTO> {
    return this.usersService.updateUserDetails(userId, input);
  }

  async updatePassword(
    userId: string,
    input: UpdatePasswordInput,
  ): Promise<UserToken> {
    const user = await this.usersService.updatePassword(userId, input);

    return this.sendTokenResponse(user);
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<string> {
    const { token, user } = await this.usersService.forgotPassword(input);

    await passwordResetToken(token, user);

    return 'Password reset token has been sent to your email';
  }

  async checkPasswordResetToken(input: ResetTokenInput): Promise<UserToken> {
    const user = await this.usersService.checkResetPasswordToken(input);

    return this.sendTokenResponse(user);
  }

  async resetPassword(
    userId: string,
    input: ResetPassword,
  ): Promise<UserToken> {
    const user = await this.usersService.resetPassword(userId, input);

    return this.sendTokenResponse(user);
  }

  async confirmEmail(input: ConfirmTokenInput): Promise<UserToken> {
    const user = await this.usersService.confirmEmail(input);

    return this.sendTokenResponse(user);
  }

  async confirmPhone(input: ConfirmTokenInput): Promise<UserToken> {
    const user = await this.usersService.confirmPhone(input);

    return this.sendTokenResponse(user);
  }

  private async sendTokenResponse(user: User): Promise<UserToken> {
    const token = this.signToken(user.userId, user.role);

    return { token, user };
  }

  private signToken(id: string, role: string) {
    const payload: JwtDto = { id, role };

    return this.jwt.sign(payload);
  }
}
