import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

import { User } from 'src/core/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { IS_PUBLIC_KEY } from 'src/core/shared/decorators/public.decorator';

export class UserJwtGuard implements CanActivate {
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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromRequest(request);

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: accessTokenSecret,
      });
      const id = payload.sub;
      const user = await this.userRepository.findOneOrFail({
        select: { id: true, username: true, refreshToken: true },
        where: { id },
      });

      if (!user.refreshToken) {
        throw new UnauthorizedException();
      }
      request['user'] = { id: user.id, username: user.username };
      return true;
    } catch (error) {
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
