import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Post('/signup')
  signUp(@Body(ValidationPipe) creds: AuthCredentialsDto) {
    return this.service.signUp(creds);
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) creds: AuthCredentialsDto) {
    return this.service.signIn(creds);
  }
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('​AuthController -> test -> req', user);
  }
}
