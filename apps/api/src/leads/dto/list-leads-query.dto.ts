import { LeadSource, LeadStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum LeadSortBy {
  CREATED_AT = 'createdAt',
  CUSTOMER_NAME = 'customerName',
  SOURCE = 'source',
  STATUS = 'status',
}

export enum LeadSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ListLeadsQueryDto {
  @ApiPropertyOptional({
    description: 'Search by customer name, email, or phone number.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({ enum: LeadSource })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 50 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @ApiPropertyOptional({ enum: LeadSortBy, default: LeadSortBy.CREATED_AT })
  @IsOptional()
  @IsEnum(LeadSortBy)
  sortBy: LeadSortBy = LeadSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: LeadSortOrder, default: LeadSortOrder.DESC })
  @IsOptional()
  @IsEnum(LeadSortOrder)
  sort: LeadSortOrder = LeadSortOrder.DESC;
}
