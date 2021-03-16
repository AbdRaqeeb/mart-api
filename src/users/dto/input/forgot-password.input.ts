import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
