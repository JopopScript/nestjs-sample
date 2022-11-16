import { CustomValidateMessage } from '@/common/validate/custom-validate-message';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePictureDto {
  @ApiProperty({ description: '사진 이름', maxLength: 255, example: '강아지' })
  @IsNotEmpty({ message: CustomValidateMessage.isNotEmpty })
  @IsString({ message: CustomValidateMessage.isString })
  @MaxLength(255, { message: CustomValidateMessage.maxLength })
  name: string;

  @ApiProperty({ description: '사진 경로', example: 'https://www.google.com/imgres?imgurl=https://abcd' })
  @IsNotEmpty({ message: CustomValidateMessage.isNotEmpty })
  @IsString({ message: CustomValidateMessage.isString })
  url: string;
}
