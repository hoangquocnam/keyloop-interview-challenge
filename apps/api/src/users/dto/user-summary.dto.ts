import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  initials!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}
