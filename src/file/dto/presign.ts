import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class PresignBody {
  @IsString()
  @ApiProperty({ type: 'string' })
  declare name: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  declare contentType?: string
}
