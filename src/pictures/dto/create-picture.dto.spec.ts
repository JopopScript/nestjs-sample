import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePictureDto } from './create-picture.dto';

describe('CreatePictureDto', () => {
  test.each([
    { name: '강아지', url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: '고양이', url: 'https://www.google.com/imgres?imgurl=bbb' },
  ])('정상처리 name: $name url: $url', async (req) => {
    //given
    const requestDtoObj = plainToInstance(CreatePictureDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(0);
  })

  test.each([
    { name: `${'a'.repeat(255)}1`, url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: {}, url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: 10, url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: true, url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: undefined, url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: null, url: 'https://www.google.com/imgres?imgurl=aaa' },
    { name: '강아지', url: [] },
    { name: '강아지', url: 10 },
    { name: '강아지', url: false },
    { name: '강아지', url: undefined },
    { name: '강아지', url: null },
  ])('에러발생(1개) name: $name url: $url', async (req) => {
    const requestDtoObj = plainToInstance(CreatePictureDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(1);
  })

  test.each([
    { name: `${'a'.repeat(255)}1`, url: [] },
    { name: {}, url: 10 },
    { name: 10, url: false },
    { name: true, url: undefined },
    { name: undefined, url: null },
    { name: null, url: {} },
  ])('에러발생(2개) name: $name url: $url', async (req) => {
    //given
    const requestDtoObj = plainToInstance(CreatePictureDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(2);
  })
});
