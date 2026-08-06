import { ApiProperty } from '@nestjs/swagger';
import { LeadStatusDto } from './lead-inbox-response.dto';
import { LeadTimelineItemDto } from './lead-detail-response.dto';

export class UpdateLeadStatusResponseDto {
  @ApiProperty({ type: LeadStatusDto })
  status!: LeadStatusDto;

  @ApiProperty({ type: LeadTimelineItemDto, nullable: true })
  timelineItem!: LeadTimelineItemDto | null;
}
