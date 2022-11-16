export class CustomError extends Error {
  status: CustomErrorStatus;
  describe?: string;
  constructor(status: CustomErrorStatus, describe?: string, error?: Error) {
      super();
      this.name = error?.name ?? '';
      this.message = error?.message ?? '';
      this.stack = error?.message;
      Object.setPrototypeOf(this, CustomError.prototype);
      this.status = status ? status : CustomErrorStatus.UNKNOWN;
      this.describe = describe ? describe : '';
  }
}

export enum CustomErrorStatus {
	DB_NO_RESULT = 'ER01',
  NOT_ALLOW_DUPLICATE = 'ER02',
  NO_RESULT = 'ER03',
	UNKNOWN = 'ER99'
}

export function getCustomErrorStatusMessage(status: CustomErrorStatus): string {
  return {
    [CustomErrorStatus.DB_NO_RESULT]: '데이터베이스 조회 결과 없음',
    [CustomErrorStatus.NOT_ALLOW_DUPLICATE]: '중복이 허용되지 않음',
    [CustomErrorStatus.NO_RESULT]: '결과가 없음',
    [CustomErrorStatus.UNKNOWN]: '알수없는 에러'
  }[status];
}