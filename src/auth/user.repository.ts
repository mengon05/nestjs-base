import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(creds: AuthCredentialsDto) {
    const { username, password } = creds;

    const salt = await bcrypt.genSalt();

    const user = this.create();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;
    try {
      await user.save();
    } catch (e) {
      //duplicated field error code
      if (e.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        throw e;
      }
    }
  }

  hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(creds: AuthCredentialsDto) {
    const { username, password } = creds;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      null;
    }
  }
}
