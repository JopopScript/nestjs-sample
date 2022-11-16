import { HttpException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './all-exception.filter';
import { CustomError, CustomErrorStatus } from './custom.error';

describe('AllExceptionsFilter', () => {
  test.each([
    { exception: [new ValidationError()], expectedResponse: { status: 404, message: 'Bad Request Exception' } },
    { exception: [new ValidationError(), new ValidationError()], expectedResponse: { status: 404, message: 'Bad Request Exception' } },
    { exception: new HttpException('test', 404), expectedResponse: { status: 404, message: 'test' } },
    { exception: new CustomError(CustomErrorStatus.DB_NO_RESULT), expectedResponse: { status: 500, message: '알수없는 오류가 발생했습니다.' } },
    { exception: new CustomError(CustomErrorStatus.DB_NO_RESULT, 'test'), expectedResponse: { status: 500, message: 'test' } },
    { exception: new Error(), expectedResponse: { status: 500, message: '알수없는 오류가 발생했습니다.' } },
  ])('catch 에러별 reponse값 검증 exception: $exception', async ({ exception, expectedResponse }) => {
    //given
    const logger = { debug: jest.fn() } as any as Logger
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockImplementation(() => ({
        json: mockJson
    }));
    const mockGetResponse = jest.fn().mockImplementation(() => ({
        status: mockStatus
    }));
    const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
        getResponse: mockGetResponse,
        getRequest: jest.fn()
    }));
    const mockArgumentsHost = {
        switchToHttp: mockHttpArgumentsHost,
        getArgByIndex: jest.fn(),
        getArgs: jest.fn(),
        getType: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn()
    };

    //when
    const allExceptionsFilter = new AllExceptionsFilter(logger);
    allExceptionsFilter.catch(exception, mockArgumentsHost);
    
    //then
    expect(mockStatus).toBeCalledWith(expectedResponse.status);
    expect(mockJson).toBeCalledWith({ message: expectedResponse.message })
  })
});
