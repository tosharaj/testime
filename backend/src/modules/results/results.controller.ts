import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.TEST_MANAGER, UserRole.ANALYST)
@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get('test/:testId')
  testResults(@Param('testId') testId: string, @Query('page') page?: string) {
    return this.resultsService.testResults(testId, { page: page ? parseInt(page) : 1, limit: 50 });
  }

  @Get('leaderboard/:testId')
  leaderboard(@Param('testId') testId: string) {
    return this.resultsService.leaderboard(testId);
  }
}
