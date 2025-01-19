import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequestDto } from './dto/login.dto';
import {
  CreateLoginSwaggerDecorators,
  CreateLogoutSwaggerDecorators,
} from './authentication.controller.swagger';
import { Public } from 'src/core/shared/decorators/public.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('login')
  @CreateLoginSwaggerDecorators()
  @HttpCode(HttpStatus.OK)
  async create(@Body() loginDto: LoginRequestDto) {
    return await this.authenticationService.login(loginDto);
  }

  @Post('logout')
  @CreateLogoutSwaggerDecorators()
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const userId = req['user']['id'];
    await this.authenticationService.logout(userId);
    return { status: HttpStatus.OK };
  }
}
