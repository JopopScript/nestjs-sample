import { CustomValidateMessage } from '@/common/validate/custom-validate-message';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: '글 제목', maxLength: 255, example: '튜토리얼' })
  @IsNotEmpty({ message: CustomValidateMessage.isNotEmpty })
  @IsString({ message: CustomValidateMessage.isString })
  @MaxLength(255, { message: CustomValidateMessage.maxLength })
  title: string;

  @ApiProperty({ description: '본문 내용', example: '시작하는법!....' })
  @IsNotEmpty({ message: CustomValidateMessage.isNotEmpty })
  @IsString({ message: CustomValidateMessage.isString })
  contents: string;
}
