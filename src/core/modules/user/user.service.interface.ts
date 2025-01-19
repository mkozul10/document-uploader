import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';

export interface UserServiceInterface {
  create(dto: CreateUserDto): Promise<CreateUserResponseDto>;
}
