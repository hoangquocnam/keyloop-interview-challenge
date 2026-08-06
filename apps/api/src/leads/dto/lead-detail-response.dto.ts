import {
  LeadActivityType,
  LeadSource,
  PreferredContactMethod,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { LeadAssigneeDto, LeadStatusDto } from './lead-inbox-response.dto';

export class LeadTimelineItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: LeadActivityType })
  type!: LeadActivityType;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  note!: string;

  @ApiProperty()
  actorName!: string;

  @ApiProperty()
  happenedAt!: Date;
}

export class LeadContactInfoDto {
  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  phone!: string | null;

  @ApiProperty({ enum: PreferredContactMethod })
  preferredMethod!: PreferredContactMethod;
}

export class LeadDetailMetadataDto {
  @ApiProperty({ enum: LeadSource })
  source!: LeadSource;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: LeadAssigneeDto, nullable: true })
  assignedTo!: LeadAssigneeDto | null;
}

export class LeadDetailDataDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerName!: string;

  @ApiProperty({ nullable: true })
  inquiry!: string | null;

  @ApiProperty({ type: LeadStatusDto })
  status!: LeadStatusDto;

  @ApiProperty({ type: LeadContactInfoDto })
  contactInfo!: LeadContactInfoDto;

  @ApiProperty({ type: LeadDetailMetadataDto })
  leadDetails!: LeadDetailMetadataDto;

  @ApiProperty({ type: LeadTimelineItemDto, isArray: true })
  timeline!: LeadTimelineItemDto[];
}
