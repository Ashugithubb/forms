import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Request } from 'express';
import { LocalGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('logout')
  logout(@Req() request): Promise<any> {
    return this.authService.logout(request);
  }
  
  @UseGuards(LocalGuard)
  @Post('login')
  login(): Promise<any> {
    return this.authService.login();
  }

}