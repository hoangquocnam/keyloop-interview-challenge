import { ApiProperty } from '@nestjs/swagger';

export class ArchiveLeadResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  archivedAt!: Date;
}
