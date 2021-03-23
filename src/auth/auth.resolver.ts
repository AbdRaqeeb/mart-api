import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserToken } from './model/user-token';
import { CreateUserInput } from '../users/dto/input/create-user.input';
import { LoginUserInput } from '../users/dto/input/login-user.input';
import { UserDTO } from '../users/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/ctx-user.decorator';
import { UpdateUserInput } from '../users/dto/input/update-user.input';
import { UpdatePasswordInput } from '../users/dto/input/update-password.input';
import { ForgotPasswordInput } from '../users/dto/input/forgot-password.input';
import { ResetTokenInput } from '../users/dto/input/reset-token.input';
import { ResetPassword } from '../users/dto/input/reset-password.input';
import { ConfirmTokenInput } from './dto/input/confirm-token.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserToken)
  async registerUser(
    @Args('input') input: CreateUserInput,
  ): Promise<UserToken> {
    return this.authService.registerUser(input);
  }

  @Mutation(() => UserToken)
  async loginUser(@Args('input') input: LoginUserInput): Promise<UserToken> {
    return this.authService.loginUser(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserDTO, { nullable: true })
  async user(@CurrentUser() user: UserDTO) {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() { userId }: UserDTO,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserDTO> {
    return this.authService.updateUser(userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserToken, { name: 'updateUserPassword' })
  async updatePassword(
    @CurrentUser() { userId }: UserDTO,
    @Args('input') input: UpdatePasswordInput,
  ): Promise<UserToken> {
    return this.authService.updatePassword(userId, input);
  }

  @Query(() => String, { name: 'forgotPassword' })
  async forgotPassword(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<string> {
    return this.authService.forgotPassword(input);
  }

  @Query(() => UserToken, { name: 'CheckResetToken' })
  async checkPasswordResetToken(
    @Args('input') input: ResetTokenInput,
  ): Promise<UserToken> {
    return this.authService.checkPasswordResetToken(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserToken, { name: 'resetPassword' })
  async resetPassword(
    @CurrentUser() { userId }: UserDTO,
    @Args('input') input: ResetPassword,
  ): Promise<UserToken> {
    return this.authService.resetPassword(userId, input);
  }

  @Mutation(() => UserToken, { name: 'confirmEmail' })
  async confirmEmail(
    @Args('input') input: ConfirmTokenInput,
  ): Promise<UserToken> {
    return this.authService.confirmEmail(input);
  }

  @Mutation(() => UserToken, { name: 'confirmPhone' })
  async confirmPhone(
    @Args('input') input: ConfirmTokenInput,
  ): Promise<UserToken> {
    return this.authService.confirmPhone(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO, { name: 'uploadProfilePhoto' })
  async uploadPhoto(
    @CurrentUser() { userId }: UserDTO,
    @Args({ name: 'image', type: () => GraphQLUpload })
    { filename, createReadStream }: FileUpload,
  ): Promise<UserDTO> {
    return this.authService.uploadProfilePhoto(
      userId,
      filename,
      createReadStream(),
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO, { name: 'updatePhoto' })
  async updatePhoto(
    @CurrentUser() { userId }: UserDTO,
    @Args('image') image: string,
  ): Promise<UserDTO> {
    return this.authService.uploadPhoto(userId, image);
  }
}
