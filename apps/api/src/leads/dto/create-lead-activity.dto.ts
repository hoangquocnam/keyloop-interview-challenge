import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export enum LeadLogActivityType {
  CALL = 'call',
  EMAIL = 'email',
  NOTE = 'note',
}

export class CreateLeadActivityDto {
  @ApiProperty({ enum: LeadLogActivityType })
  @IsEnum(LeadLogActivityType)
  type!: LeadLogActivityType;

  @ApiProperty({
    example: 'Left a voicemail to confirm tomorrow morning appointment.',
  })
  @IsString()
  @MaxLength(2000)
  note!: string;
}
