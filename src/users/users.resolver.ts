import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './model/user.model';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserDTO, { name: 'user' })
  async getUser(@Args('userId') userId: string) {
    await this.usersService.getUserById(userId);
  }
}
