import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/core/shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomersServiceInterface } from './authentication.service.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthenticationService implements CustomersServiceInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private async getTokens(userId: number, username: string) {
    const accessTokenSecret = this.configService.get<string>(
      'auth.accessTokenSecret',
    );
    const refreshTokenSecret = this.configService.get<string>(
      'auth.refreshTokenSecret',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: accessTokenSecret,
          expiresIn: '20m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: refreshTokenSecret,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      select: { id: true, username: true, password: true },
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException(
        `User with username ${loginDto.username} does not exist`,
      );
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.getTokens(user.id, user.username);

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        refreshToken: tokens.refreshToken,
      },
    );
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: number) {
    await this.userRepository.update({ id: userId }, { refreshToken: null });
  }

  async refresh(userId: number): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const tokens = await this.getTokens(user.id, user.username);

    await this.userRepository.update(
      { id: user.id },
      { refreshToken: tokens.refreshToken },
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
