import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateArticleDto } from './create-article.dto';

describe('CreateArticleDto', () => {
  test.each([
    { title: '튜토리얼', contents: 'hello\nworld' },
    { title: 'a', contents: 'b' },
  ])('정상처리 title: $title contents: $contents', async (req) => {
    //given
    const requestDtoObj = plainToInstance(CreateArticleDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(0);
  })

  test.each([
    { title: `${'a'.repeat(255)}1`, contents: 'hello' },
    { title: {}, contents: 'hello' },
    { title: 10, contents: 'hello' },
    { title: true, contents: 'hello' },
    { title: undefined, contents: 'hello' },
    { title: null, contents: 'hello' },
    { title: 'tutorial', contents: [] },
    { title: 'tutorial', contents: 10 },
    { title: 'tutorial', contents: false },
    { title: 'tutorial', contents: undefined },
    { title: 'tutorial', contents: null },
  ])('에러발생(1개) title: $title contents: $contents', async (req) => {
    const requestDtoObj = plainToInstance(CreateArticleDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(1);
  })

  test.each([
    { title: `${'a'.repeat(255)}1`, contents: [] },
    { title: {}, contents: 10 },
    { title: true, contents: undefined },
    { title: null, contents: '' },
  ])('에러발생(2개) title: $title contents: $contents', async (req) => {
    //given
    const requestDtoObj = plainToInstance(CreateArticleDto, req);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(2);
  })
});
