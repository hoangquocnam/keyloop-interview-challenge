import { LeadStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LeadAssigneeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  initials!: string;
}

export class LeadStatusDto {
  @ApiProperty({ enum: LeadStatus })
  value!: LeadStatus;

  @ApiProperty()
  label!: string;

  @ApiProperty({ enum: ['neutral', 'info', 'success'] })
  tone!: 'neutral' | 'info' | 'success';
}

export class LeadInboxItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerName!: string;

  @ApiProperty()
  contactEmail!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  source!: string;

  @ApiProperty({ type: LeadStatusDto })
  status!: LeadStatusDto;

  @ApiProperty({ type: LeadAssigneeDto, nullable: true })
  assignedTo!: LeadAssigneeDto | null;

  @ApiProperty()
  lastActivity!: string;

  @ApiProperty()
  hasUnreadIndicator!: boolean;
}

export class LeadInboxPaginationDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  summaryLabel!: string;
}

export class LeadInboxResponseDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  summary!: string;

  @ApiProperty({ type: LeadInboxItemDto, isArray: true })
  items!: LeadInboxItemDto[];

  @ApiProperty({ type: LeadInboxPaginationDto })
  pagination!: LeadInboxPaginationDto;
}
