import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ArchiveLeadResponseDto } from './dto/archive-lead-response.dto';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  LeadDetailDataDto,
  LeadTimelineItemDto,
} from './dto/lead-detail-response.dto';
import { LeadInboxDataDto } from './dto/lead-inbox-response.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { UpdateLeadStatusResponseDto } from './dto/update-lead-status-response.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new lead from the sales portal intake form',
  })
  @ApiCreatedResponse({ type: LeadDetailDataDto })
  createLead(
    @Body() createLeadDto: CreateLeadDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<LeadDetailDataDto> {
    return this.leadsService.createLead(user.sub, createLeadDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Return the lead inbox dataset with search, filter, and pagination support',
  })
  @ApiOkResponse({ type: LeadInboxDataDto })
  listLeads(@Query() query: ListLeadsQueryDto): Promise<LeadInboxDataDto> {
    return this.leadsService.listLeads(query);
  }

  @Get(':leadId')
  @ApiOperation({
    summary: 'Return the detail view dataset for a specific lead',
  })
  @ApiOkResponse({ type: LeadDetailDataDto })
  getLeadDetail(
    @Param('leadId', new ParseUUIDPipe()) leadId: string,
  ): Promise<LeadDetailDataDto> {
    return this.leadsService.getLeadDetail(leadId);
  }

  @Post(':leadId/activities')
  @ApiOperation({
    summary: 'Create a follow-up activity for the specified lead',
  })
  @ApiOkResponse({ type: LeadTimelineItemDto })
  createLeadActivity(
    @Param('leadId', new ParseUUIDPipe()) leadId: string,
    @Body() createLeadActivityDto: CreateLeadActivityDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<LeadTimelineItemDto> {
    return this.leadsService.createLeadActivity(
      leadId,
      user.sub,
      createLeadActivityDto,
    );
  }

  @Patch(':leadId/status')
  @ApiOperation({ summary: 'Update the status for the specified lead' })
  @ApiOkResponse({ type: UpdateLeadStatusResponseDto })
  updateLeadStatus(
    @Param('leadId', new ParseUUIDPipe()) leadId: string,
    @Body() updateLeadStatusDto: UpdateLeadStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UpdateLeadStatusResponseDto> {
    return this.leadsService.updateLeadStatus(
      leadId,
      user.sub,
      updateLeadStatusDto,
    );
  }

  @Patch(':leadId/archive')
  @ApiOperation({
    summary: 'Archive the specified lead using soft delete semantics',
  })
  @ApiOkResponse({ type: ArchiveLeadResponseDto })
  archiveLead(
    @Param('leadId', new ParseUUIDPipe()) leadId: string,
  ): Promise<ArchiveLeadResponseDto> {
    return this.leadsService.archiveLead(leadId);
  }
}
