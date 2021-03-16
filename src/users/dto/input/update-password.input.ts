import { Field, InputType } from '@nestjs/graphql';
import { MinLength, IsString } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field()
  @MinLength(6, {
    message: 'Password must be 6 or more characters',
  })
  @IsString()
  currentPassword: string;

  @Field()
  @MinLength(6, {
    message: 'Password must be 6 or more characters',
  })
  @IsString()
  newPassword: string;
}
