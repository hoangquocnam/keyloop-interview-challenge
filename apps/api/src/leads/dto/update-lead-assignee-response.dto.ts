import { ApiProperty } from '@nestjs/swagger';
import { LeadAssigneeDto } from './lead-inbox-response.dto';
import { LeadTimelineItemDto } from './lead-detail-response.dto';

export class UpdateLeadAssigneeResponseDto {
  @ApiProperty({ type: LeadAssigneeDto, nullable: true })
  assignedTo!: LeadAssigneeDto | null;

  @ApiProperty({ type: LeadTimelineItemDto, nullable: true })
  timelineItem!: LeadTimelineItemDto | null;
}
