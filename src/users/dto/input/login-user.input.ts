import { InputType, Field } from '@nestjs/graphql';
import { MinLength, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  user: string;

  @Field()
  @MinLength(6, {
    message: 'Password must be 6 or more characters',
  })
  @IsNotEmpty()
  password: string;
}
