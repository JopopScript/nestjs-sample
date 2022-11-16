import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError, CustomErrorStatus } from '../common/error/custom.error';
import { StubTypeOrmRepository } from '../test/typeorm-repository.stub';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: new StubTypeOrmRepository<User>(),
        },
      ],
    }).compile();
    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
    repository.save({ name: 'keroro1', email: 'lssmm1231@gmail.com' });
    repository.save({ name: 'keroro2', email: 'lssmm1232@gmail.com' });
    repository.save({ name: 'keroro3', email: 'lssmm1233@gmail.com' });
    repository.save({ name: 'keroro4', email: 'lssmm1234@gmail.com' });
    repository.save({ name: 'keroro5', email: 'lssmm1235@gmail.com' });
    repository.save({ name: 'keroro6', email: 'lssmm1236@gmail.com' });
    repository.save({ name: 'keroro7', email: 'lssmm1237@gmail.com' });
    repository.save({ name: 'keroro8', email: 'lssmm1238@gmail.com' });
    repository.save({ name: 'keroro9', email: 'lssmm1239@gmail.com' });
    repository.save({ name: 'keroro0', email: 'lssmm1230@gmail.com' });
  });

  describe('create', () => {
    it('정상처리', async () => {
      //given
      const expectedResult = {
        id: 11,
        deletedAt: null,
        name: 'keroro',
        email: 'lssmm9999@gmail.com'
      }

      //when
      const createdUser = await service.create({ name: 'keroro', email: 'lssmm9999@gmail.com' });

      //then
      expect(createdUser).toMatchObject(expectedResult);
    });

    it('에러발생: 동일한 email의 user가 이미 존재하는 경우', async () => {
      //when
      const createdUser = service.create({ name: 'keroro', email: 'lssmm1231@gmail.com' });

      //then
      const expectedError = new CustomError(CustomErrorStatus.NOT_ALLOW_DUPLICATE, `email: lssmm1231@gmail.com | email 같은 user가 이미 존재하여 생성할 수 없습니다.`);
      expect(createdUser).rejects.toEqual(expectedError);
    });
  });

  it('findAll 정상처리', async () => {
    // when
    const foundUsers = await service.findAll({ page: 2, pageSize: 3 });

    //then
    const expectedUsers = [
      { id: 4, name: 'keroro4', email: 'lssmm1234@gmail.com' },
      { id: 5, name: 'keroro5', email: 'lssmm1235@gmail.com' },
      { id: 6, name: 'keroro6', email: 'lssmm1236@gmail.com' },
    ]
    for (let i = 0; i < foundUsers.length; i++) {
      expect(foundUsers[i]).toMatchObject(expectedUsers[i]);
    }
  });

  describe('findOneById', () => {
    it('정상처리', async () => {
      //when
      const foundUser = await service.findOneById(1);

      //then
      expect(foundUser).toMatchObject({ id: 1, name: 'keroro1', email: 'lssmm1231@gmail.com' });
    });

    it('에러발생: id를 가진 user가 없는 경우', async () => {
      //when
      const foundUser = service.findOneById(99);

      //then
      const expectedError = new CustomError(CustomErrorStatus.NO_RESULT, `id: 99 |해당 id의 user가 존재하지 않습니다.`);
      expect(foundUser).rejects.toEqual(expectedError);
    });
  });
});
