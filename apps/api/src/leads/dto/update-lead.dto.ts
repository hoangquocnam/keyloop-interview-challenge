import { LeadSource, PreferredContactMethod } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateLeadDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerName?: string;

  @ApiPropertyOptional({ example: 'jane@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: '(555) 123-4567', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null;

  @ApiPropertyOptional({ enum: PreferredContactMethod })
  @IsOptional()
  @IsEnum(PreferredContactMethod)
  preferredContactMethod?: PreferredContactMethod;

  @ApiPropertyOptional({ enum: LeadSource })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Interested in the 2024 SUV with financing options.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  inquiry?: string | null;
}
