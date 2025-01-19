import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { ErrorDto } from 'src/core/shared/dto/error.dto';
import { applyDecorators } from '@nestjs/common';

export function CreateLoginSwaggerDecorators() {
  return applyDecorators(
    ApiTags('authentication'),
    ApiOperation({
      summary: 'Login',
      description: 'Login with credentials.',
    }),
    ApiBody({
      description: 'The request body',
      type: LoginRequestDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'The user has been successfully logged in.',
      type: LoginResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
  );
}

export function CreateLogoutSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiTags('authentication'),
    ApiOperation({
      summary: 'Logout',
      description: 'Logout',
    }),
    ApiOkResponse({
      description: 'The user has been successfully logged out.',
      type: LogoutResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Error response',
      type: ErrorDto,
    }),
  );
}

class LogoutResponseDto {
  @ApiProperty({ example: 200, required: true, type: Number })
  status: number;
}
