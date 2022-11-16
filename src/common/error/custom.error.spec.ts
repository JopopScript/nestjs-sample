import { CustomError, CustomErrorStatus, getCustomErrorStatusMessage } from "./custom.error";

describe('CustomError', () => {
  test.each([
    { status: CustomErrorStatus.DB_NO_RESULT, describe: 'test', parentError: new Error(), expectedDescribe: 'test' },
    { status: CustomErrorStatus.UNKNOWN, describe: undefined, parentError: undefined, expectedDescribe: '' },
    { status: CustomErrorStatus.UNKNOWN, describe: 'test', parentError: undefined, expectedDescribe: 'test' },
  ])('생성 정상처리 status: $status, describe: $describe, parentError: $parentError', async ({ status, describe, parentError, expectedDescribe }) => {
    //when
    const customError = new CustomError(status, describe, parentError);
    
    //then
    expect(customError.status).toEqual(status);
    expect(customError.describe).toEqual(expectedDescribe);
    expect(customError).toBeInstanceOf(CustomError);
    expect(customError).toBeInstanceOf(Error);
  })
});

describe('getCustomErrorStatusMessage', () => {
  test.each([
    { status: CustomErrorStatus.DB_NO_RESULT, expectedMessage: '데이터베이스 조회 결과 없음' },
    { status: CustomErrorStatus.UNKNOWN, expectedMessage: '알수없는 에러' },
  ])('정상처리 status: $status', async ({ status, expectedMessage }) => {
    //when
    const message = getCustomErrorStatusMessage(status);
    
    //then
    expect(message).toEqual(expectedMessage);
  })
});
