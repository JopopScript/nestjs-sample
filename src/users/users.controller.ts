import { PagenationDto } from '@/common/dto/pagenation.dto';
import {
  Body,
  Controller, Get, Post,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation, getSchemaPath
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const USERS = 'users' as const;
@Controller(USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ tags: [USERS], summary: '사용자 생성', description: '사용자를 생성합니다.' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: User, description: '생성된 사용자 정보' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ tags: [USERS], summary: '사용자 페이지별 조회', description: '사용자목록을 페이지로 조회합니다.' })
  @ApiOkResponse({
    description: '조회된 사용자 목록',
    schema: { type: 'array', items: { $ref: getSchemaPath(User) } },
  })
  findAll(@Query() query: PagenationDto) {
    return this.usersService.findAll(query.transform());
  }
}
