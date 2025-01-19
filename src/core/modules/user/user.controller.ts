import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/core/shared/decorators/public.decorator';
import { AdminJwtGuard } from '../authentication/guards/admin-jwt.guard';
import { CreateUserSwaggerDecorators } from './user.controller.swagger';

@Public()
@UseGuards(AdminJwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CreateUserSwaggerDecorators()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
