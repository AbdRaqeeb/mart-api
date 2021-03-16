import { Field, ObjectType } from '@nestjs/graphql';
import { UserDTO } from '../../users/dto/user.dto';

@ObjectType()
export class UserToken {
  @Field()
  token: string;

  @Field()
  user: UserDTO;
}
