import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatePictureDto } from './update-picture.dto';

describe('UpdatePictureDto', () => {
  test.each([
    { name: '강아지', url: 'https://www.google.com/imgres?imgurl=https://abcd' },
    { name: 'a', url: 'b' },
    { name: '강아지', url: undefined },
    { name: undefined, url: 'https://www.google.com/imgres?imgurl=https://abcd' },
  ])('정상처리 name: $name url: $url', async (req) => {
    //given
    const requestDtoObj = plainToInstance(UpdatePictureDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(0);
  })

  test.each([
    { name: `${'a'.repeat(255)}1`, url: 'https://www.google.com/imgres?imgurl=https://abcd' },
    { name: {}, url: 'https://www.google.com/imgres?imgurl=https://abcd' },
    { name: 10, url: 'https://www.google.com/imgres?imgurl=https://abcd' },
    { name: true, url: 'https://www.google.com/imgres?imgurl=https://abcd' },
    { name: '강아지', url: [] },
    { name: '강아지', url: 10 },
    { name: '강아지', url: false },
  ])('에러발생(1개) name: $name url: $url', async (req) => {
    const requestDtoObj = plainToInstance(UpdatePictureDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(1);
  })

  test.each([
    { name: `${'a'.repeat(255)}1`, url: [] },
    { name: {}, url: 10 },
    { name: true, url: false },
    { name: '', url: '' },
  ])('에러발생(2개) name: $name url: $url', async (req) => {
    //given
    const requestDtoObj = plainToInstance(UpdatePictureDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(2);
  })
});
