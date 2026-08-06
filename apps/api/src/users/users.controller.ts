import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserSummaryDto } from './dto/user-summary.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Return the list of users available for lead assignment',
  })
  @ApiOkResponse({ type: UserSummaryDto, isArray: true })
  listUsers(): Promise<UserSummaryDto[]> {
    return this.usersService.listUsers();
  }
}
