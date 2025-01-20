import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { ErrorDto } from 'src/core/shared/dto/error.dto';

export function CreateUserSwaggerDecorators() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiTags('user'),
    ApiOperation({
      summary: 'Create user',
      description: 'Create app user',
    }),
    ApiBody({
      description: 'The request body',
      type: CreateUserDto,
      required: true,
    }),
    ApiCreatedResponse({
      description: 'The user has been successfully created',
      type: CreateUserResponseDto,
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
