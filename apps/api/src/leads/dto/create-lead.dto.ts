import { LeadSource, PreferredContactMethod } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  customerName!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  email!: string;

  @ApiProperty({ example: '(555) 123-4567', nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({ enum: PreferredContactMethod })
  @IsEnum(PreferredContactMethod)
  preferredContactMethod!: PreferredContactMethod;

  @ApiProperty({ enum: LeadSource })
  @IsEnum(LeadSource)
  source!: LeadSource;

  @ApiProperty({
    nullable: true,
    required: false,
    description: 'Set null or omit to keep the lead in the unassigned queue.',
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    example: 'Interested in the 2024 SUV with financing options.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  inquiry?: string;
}
