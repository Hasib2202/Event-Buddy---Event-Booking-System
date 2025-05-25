import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() body: RegisterDto) {
    const { name, email, password } = body;
    return this.authService.register(name, email, password);
  }

  // src/auth/auth.controller.ts
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const result = await this.authService.login(email, password);

    return {
      access_token: result.access_token, // Keep consistent naming
      user: result.user
    };
  }
}
