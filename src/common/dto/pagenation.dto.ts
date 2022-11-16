import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CustomValidateMessage } from '../validate/custom-validate-message';
import { IsIntString } from '../validate/is-int-string.validator';

export type pagenation = {
  page: number,
  pageSize: number
}
export class PagenationDto {
  @ApiProperty({
    type: 'integer',
    description: '조회할 페이지',
    example: '1',
    required: false,
    default: '1',
  })
  @IsOptional()
  @IsIntString({ message: CustomValidateMessage.isIntString })
  page: string = '1';
  
  @ApiProperty({
    type: 'integer',
    description: '한페이지에 보여질 수',
    example: '10',
    required: false,
    default: '10',
  })
  @IsOptional()
  @IsIntString({ message: CustomValidateMessage.isIntString })
  pageSize: string = '10';

  transform(): pagenation {
    return {
      page: Number(this.page),
      pageSize: Number(this.pageSize)
    }
  }
}