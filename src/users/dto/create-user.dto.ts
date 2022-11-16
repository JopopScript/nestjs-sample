import { CustomValidateMessage } from '@/common/validate/custom-validate-message';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '표시될 사용자이름', maxLength: 20, example: 'keroro' })
  @IsNotEmpty({ message: CustomValidateMessage.isNotEmpty })
  @IsString({ message: CustomValidateMessage.isString })
  @MaxLength(20, { message: CustomValidateMessage.maxLength })
  name: string;

  @ApiProperty({ description: '사용자 고유 아이디', maxLength: 200, example: 'lssmm1230@gmail.com', uniqueItems: true })
  @IsNotEmpty({ message: CustomValidateMessage.isNotEmpty })
  @IsString({ message: CustomValidateMessage.isString })
  @MaxLength(200, { message: CustomValidateMessage.maxLength })
  email: string;
}
