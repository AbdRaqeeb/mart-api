import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserDTO {
  @Field(() => ID)
  userId: string;

  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  address: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  isEmailConfirmed: boolean;

  @Field({ nullable: true })
  isPhoneConfirmed: boolean;
}
