export class CustomValidateMessage {
  static isNotEmpty(customValidationArguments: { value: any, property: string }) {
    return `value:${customValidationArguments.value}|${customValidationArguments.property} should not be empty`;
  }

  static isString(customValidationArguments: { value: any, property: string }) {
    return `value:${customValidationArguments.value}|${customValidationArguments.property} must be a string`;
  }

  static isIntString(customValidationArguments: { value: any, property: string }) {
    return `value:${customValidationArguments.value}|${customValidationArguments.property} must be a integer string`;
  }

  static maxLength(customValidationArguments: { value: any, property: string, constraints: number[] }) {
    return `value:${customValidationArguments.value}|${customValidationArguments.property} must be shorter than or equal to ${customValidationArguments.constraints[0]} characters`;
  }
};