import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/database/typeorm-config.service';
import authConfig from './config/auth.config';
import { APP_GUARD } from '@nestjs/core';

import { User } from './core/shared/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationModule } from './core/modules/authentication/authentication.module';
import { UserJwtGuard } from './core/modules/authentication/guards/user-jwt.guard';
import { UserModule } from './core/modules/user/user.module';
import gcpConfig from './config/gcp.config';
import { DocumentModule } from './core/modules/document/document.module';
import { GcpModule } from './infrastructure/gcp/gcp.module';
import { MailModule } from './core/modules/mail/mail.module';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, authConfig, gcpConfig, mailConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigModule],
    }),
    TypeOrmModule.forFeature([User]),
    AuthenticationModule,
    UserModule,
    DocumentModule,
    GcpModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: UserJwtGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
