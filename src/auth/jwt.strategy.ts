import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
const jwtCfg = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRep: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtCfg.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    console.log('​JwtStrategy -> validate -> payload', payload);
    const user = await this.userRep.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
