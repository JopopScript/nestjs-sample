import { CustomValidateMessage } from './custom-validate-message';

describe('CustomValidateMessage', () => {
  test.each([
    {
      validationArguments: { value: undefined, property: 'name' },
      expectedMessage: 'value:undefined|name should not be empty'
    },
    {
      validationArguments: { value: null, property: 'page' },
      expectedMessage: 'value:null|page should not be empty'
    },
    {
      validationArguments: { value: '', property: 'url' },
      expectedMessage: 'value:|url should not be empty'
    },
  ])('isNotEmpty 정상처리 validationArguments: $validationArguments', async ({ validationArguments, expectedMessage }) => {
    //when
    const customValidateMessage = CustomValidateMessage.isNotEmpty(validationArguments);

    //then
    expect(customValidateMessage).toEqual(expectedMessage);
  })

  test.each([
    {
      validationArguments: { value: undefined, property: 'name' },
      expectedMessage: 'value:undefined|name must be a string'
    },
    {
      validationArguments: { value: null, property: 'page' },
      expectedMessage: 'value:null|page must be a string'
    },
    {
      validationArguments: { value: 123, property: 'url' },
      expectedMessage: 'value:123|url must be a string'
    },
    {
      validationArguments: { value: true, property: 'url' },
      expectedMessage: 'value:true|url must be a string'
    },
    {
      validationArguments: { value: {}, property: 'url' },
      expectedMessage: 'value:[object Object]|url must be a string'
    },
  ])('isString 정상처리 validationArguments: $validationArguments', async ({ validationArguments, expectedMessage }) => {
    //when
    const customValidateMessage = CustomValidateMessage.isString(validationArguments);

    //then
    expect(customValidateMessage).toEqual(expectedMessage);
  })

  test.each([
    {
      validationArguments: { value: undefined, property: 'name' },
      expectedMessage: 'value:undefined|name must be a string'
    },
    {
      validationArguments: { value: null, property: 'page' },
      expectedMessage: 'value:null|page must be a string'
    },
    {
      validationArguments: { value: 123, property: 'url' },
      expectedMessage: 'value:123|url must be a string'
    },
    {
      validationArguments: { value: true, property: 'url' },
      expectedMessage: 'value:true|url must be a string'
    },
    {
      validationArguments: { value: {}, property: 'url' },
      expectedMessage: 'value:[object Object]|url must be a string'
    },
  ])('isString 정상처리 validationArguments: $validationArguments', async ({ validationArguments, expectedMessage }) => {
    //when
    const customValidateMessage = CustomValidateMessage.isString(validationArguments);

    //then
    expect(customValidateMessage).toEqual(expectedMessage);
  })

  test.each([
    {
      validationArguments: { value: '1.0', property: 'page' },
      expectedMessage: 'value:1.0|page must be a integer string'
    },
    {
      validationArguments: { value: 'true', property: 'pageSize' },
      expectedMessage: 'value:true|pageSize must be a integer string'
    },
    {
      validationArguments: { value: 'abc', property: 'id' },
      expectedMessage: 'value:abc|id must be a integer string'
    },
  ])('isIntString 정상처리 validationArguments: $validationArguments', async ({ validationArguments, expectedMessage }) => {
    //when
    const customValidateMessage = CustomValidateMessage.isIntString(validationArguments);

    //then
    expect(customValidateMessage).toEqual(expectedMessage);
  })
  
  test.each([
    {
      validationArguments: { value: 'ab', property: 'name', constraints: [1] },
      expectedMessage: 'value:ab|name must be shorter than or equal to 1 characters',
    },
    {
      validationArguments: { value: '12345678901', property: 'name', constraints: [10] },
      expectedMessage: `value:12345678901|name must be shorter than or equal to 10 characters`,
    },
  ])('maxLength 정상처리 validationArguments: $validationArguments', async ({ validationArguments, expectedMessage }) => {
    //when
    const customValidateMessage = CustomValidateMessage.maxLength(validationArguments);

    //then
    expect(customValidateMessage).toEqual(expectedMessage);
  })
});
