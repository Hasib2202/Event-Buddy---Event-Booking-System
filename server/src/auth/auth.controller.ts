import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    const { name, email, password } = body;
    return this.authService.register(name, email, password);
  }

   @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const result = await this.authService.login(email, password);
    return {
      token: result.access_token,
      user: result.user
    };
  }
}
