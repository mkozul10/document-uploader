import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';

export interface CustomersServiceInterface {
  login(dto: LoginRequestDto): Promise<LoginResponseDto>;
  logout(userId: number): Promise<void>;
  refresh(userId: number): Promise<LoginResponseDto>;
}
