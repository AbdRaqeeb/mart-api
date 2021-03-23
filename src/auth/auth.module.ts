import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { jwtConstants, jwtExpire } from '../common/constants/jwt.constant';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtExpire.expiresIn },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GqlAuthGuard],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
