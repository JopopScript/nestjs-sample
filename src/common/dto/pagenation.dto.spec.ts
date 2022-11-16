import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { pagenation, PagenationDto } from "./pagenation.dto";

describe('PagenationDto', () => {
  test.each([
    { page: undefined, pageSize: undefined },
    { page: '13', pageSize: undefined },
    { page: undefined, pageSize: '20' },
    { page: '13', pageSize: '20' },
  ])('생성 정상처리 page: $page, pageSize: $pageSize', async (requestDto) => {
    //given
    const requestDtoObj = plainToInstance(PagenationDto, requestDto);

    //when
    const errors = await validate(requestDtoObj);
    
    //then
    expect(errors.length).toBe(0);
  })

  test.each([
    { 
      page: 'five',
      pageSize: 'true',
      expectedErrors: [
        { value: 'five', property: 'page', constraints: 'IsIntString' },
        { value: 'true', property: 'pageSize', constraints: 'IsIntString' },
      ]
    },
    {
      page: 'true',
      pageSize: undefined,
      expectedErrors: [{ value: 'true', property: 'page', constraints: 'IsIntString' }]
    },
    { page: undefined,
      pageSize: '열',
      expectedErrors: [{ value: '열', property: 'pageSize', constraints: 'IsIntString' }]
    },
  ])('생성 에러발생 page: $page, pageSize: $pageSize', async ({ page, pageSize, expectedErrors }) => {
    //given
    const requestDto = { page, pageSize };
    const requestDtoObj = plainToInstance(PagenationDto, requestDto);

    //when
    const errors = await validate(requestDtoObj);

    //then
    expect(errors.length).toBe(expectedErrors.length);
    for (let i = 0; i < errors.length; i++) {
      expect(errors[i].value).toBe(expectedErrors[i].value)
      expect(errors[i].property).toBe(expectedErrors[i].property)
      expect(JSON.stringify(errors[i])).toContain(expectedErrors[i].constraints)
    }
  })
  
  test.each([
    { page: '1', pageSize: '10', expected: { page: 1, pageSize: 10 } },
    { page: '13', pageSize: '25', expected: { page: 13, pageSize: 25 }  },
  ])('transform 정상처리 page: $page, pageSize: $pageSize', async ({ page, pageSize, expected}) => {
    //given
    const requestDtoObj = plainToInstance(PagenationDto, { page, pageSize });

    //when
    const pagenation: pagenation = requestDtoObj.transform()
    
    //then
    expect(pagenation).toEqual(expected);
  })
});
