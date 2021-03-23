import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtDto } from '../dto/jwt.dto';
import { jwtConstants } from '../../common/constants/jwt.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate({ id, role }: JwtDto) {
    let user;

    if (role === 'user') {
      user = await this.authService.validateUser(id);
    }

    if (!user) {
      throw new UnauthorizedException(
        `User can not access route. No headers token`,
      );
    }

    return user;
  }
}
