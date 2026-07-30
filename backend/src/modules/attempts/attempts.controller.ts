import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttemptsService } from './attempts.service';
import { SubmitAttemptDto, StartAttemptDto } from './dto/attempts.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Attempts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attempts')
export class AttemptsController {
  constructor(private attemptsService: AttemptsService) {}

  @Post('start')
  start(@Body() dto: StartAttemptDto, @CurrentUser() user) {
    return this.attemptsService.startAttempt(user.id, dto.testId);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() dto: SubmitAttemptDto, @CurrentUser() user) {
    return this.attemptsService.submitAttempt(id, user.id, dto);
  }

  @Get()
  myAttempts(@CurrentUser() user, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.attemptsService.userAttempts(user.id, { page: page ? parseInt(page) : 1, limit: limit ? parseInt(limit) : 20 });
  }

  @Get(':id')
  getAttempt(@Param('id') id: string, @CurrentUser() user) {
    return this.attemptsService.getAttempt(id, user.id);
  }
}
