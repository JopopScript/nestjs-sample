import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const str20 = '1234567890'.repeat(2);
  const str200 = '1234567890'.repeat(20);

  test.each([
    { name: 'a', email: 'a' },
    { name: str20, email: str200 },
  ])('정상처리 name: $name email: $email', async (req) => {
    //given
    const requestDtoObj = plainToInstance(CreateUserDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(0);
  })

  test.each([
    { name: `${str20}1`, email: 'kero@gmail.com' },
    { name: `kero`, email: `${str200}1` },
    { name: {}, email: 'kero@gmail.com' },
    { name: 10, email: 'kero@gmail.com' },
    { name: true, email: 'kero@gmail.com' },
    { name: undefined, email: 'kero@gmail.com' },
    { name: null, email: 'kero@gmail.com' },
    { name: 'kero', email: [] },
    { name: 'kero', email: 10 },
    { name: 'kero', email: false },
    { name: 'kero', email: undefined },
    { name: 'kero', email: null },
  ])('에러발생(1개) name: $name email: $email', async (req) => {
    const requestDtoObj = plainToInstance(CreateUserDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(1);
  })

  test.each([
    { name: `${str20}1`, email: `${str200}1` },
    { name: 11, email: true },
    { name: [], email: {} },
    { name: '', email: undefined },
  ])('에러발생(2개) name: $name email: $email', async (req) => {
    //given
    const requestDtoObj = plainToInstance(CreateUserDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(2);
  })
});
