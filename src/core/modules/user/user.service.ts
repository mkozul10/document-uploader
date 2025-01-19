import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/shared/entities/user.entity';
import { Role } from 'src/core/shared/entities/role.entity';
import { UserServiceInterface } from './user.service.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const userExists = await this.userRepository.exists({
      where: { username: createUserDto.username },
    });

    if (userExists) {
      throw new BadRequestException(
        `User ${createUserDto.username} already exists`,
      );
    }

    const role = await this.roleRepository.findOne({
      select: { id: true },
      where: { name: createUserDto.role },
    });

    if (!role) {
      throw new BadRequestException(`Role ${createUserDto.role} not found`);
    }

    const user = new User();

    const password = bcrypt.hashSync(createUserDto.password, 10);

    user.username = createUserDto.username;
    user.password = password;
    user.roleId = role.id;

    const createdUser = await this.userRepository.save(user);

    return {
      id: createdUser.id,
      username: createdUser.username,
      role: createUserDto.role,
      createdAt: createdUser.createdAt,
    };
  }
}
