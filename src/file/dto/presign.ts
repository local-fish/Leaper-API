import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PresignBody {
  @IsString()
  @ApiProperty({ type: 'string' })
  declare name: string
}
