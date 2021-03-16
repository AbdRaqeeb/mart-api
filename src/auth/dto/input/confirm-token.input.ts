import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class ConfirmTokenInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}
