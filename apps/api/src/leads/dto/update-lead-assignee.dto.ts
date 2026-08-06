import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateLeadAssigneeDto {
  @ApiProperty({
    description: 'Set null to move the lead back to the unassigned queue.',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string | null;
}
