import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ResetTokenInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}
