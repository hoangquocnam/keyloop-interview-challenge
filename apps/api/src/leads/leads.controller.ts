import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LeadInboxDataDto } from './dto/lead-inbox-response.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Return the lead inbox dataset with search, filter, and pagination support',
  })
  @ApiOkResponse({ type: LeadInboxDataDto })
  listLeads(@Query() query: ListLeadsQueryDto): Promise<LeadInboxDataDto> {
    return this.leadsService.listLeads(query);
  }
}
