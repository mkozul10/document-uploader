import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

import { User } from 'src/core/shared/entities/user.entity';
import { Repository } from 'typeorm';

export class AdminJwtGuard implements CanActivate {
  private readonly adminRole = 'admin';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessTokenSecret = this.configService.get<string>(
      'auth.accessTokenSecret',
    );

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromRequest(request);

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: accessTokenSecret,
      });
      const id = payload.sub;
      const user = await this.userRepository.findOneOrFail({
        select: {
          id: true,
          username: true,
          refreshToken: true,
          role: { id: true, name: true },
        },
        where: { id },
        relations: { role: true },
      });

      if (!user.refreshToken) {
        throw new UnauthorizedException();
      }

      if (user?.role?.name !== this.adminRole) {
        throw new ForbiddenException();
      }

      request['user'] = { id: user.id, username: user.username };
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException();
      }
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromRequest(request: Request) {
    const accessToken: string = request.headers['authorization'];
    if (!accessToken) {
      return '';
    }
    const segments = accessToken.split(' ');
    if (segments.length === 2 && segments.includes('Bearer')) {
      return segments[1];
    }
    return '';
  }
}
