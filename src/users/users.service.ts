import { pagenation } from '@/common/dto/pagenation.dto';
import { CustomError, CustomErrorStatus } from '@/common/error/custom.error';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    Logger.debug(`UsersService |create() call |createUserDto: `, createUserDto);
    const equalEmailUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (equalEmailUser) {
        throw new CustomError(CustomErrorStatus.NOT_ALLOW_DUPLICATE, `email: ${createUserDto.email} | email 같은 user가 이미 존재하여 생성할 수 없습니다.`);
    }
    return await this.usersRepository.save(createUserDto);
  }

  async findAll({ page, pageSize }: pagenation): Promise<Array<User>> {
    Logger.debug(`UsersService |findAll() call |page: ${page} |pageSize: ${pageSize}`);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return await this.usersRepository.find({
      // relations: ['articles', 'articles.pictures'],
      skip,
      take
    });
  }

  async findOneById(id: number): Promise<User> {
    Logger.debug(`UsersService |findOneById() call |id: ${id}`);
    const user = await this.usersRepository.findOne({
      // relations: ['articles', 'articles.pictures'],
      where: { id },
    });
    if (user === null) {
      throw new CustomError(CustomErrorStatus.NO_RESULT, `id: ${id} |해당 id의 user가 존재하지 않습니다.`);
    }
    return user;
  }
}
