import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/model/user.model';

@ObjectType()
export class PasswordResetToken {
  @Field()
  token: string;

  @Field()
  user: User;
}
