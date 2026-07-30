import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto, BulkImportDto } from './dto/questions.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Public()
  @Get()
  findAll(@Query() query: PaginationDto, @Query('examId') examId?: string, @Query('subjectId') subjectId?: string, @Query('topicId') topicId?: string, @Query('difficulty') difficulty?: string, @Query('year') year?: string, @Query('search') search?: string) {
    return this.questionsService.findAll(query, { examId, subjectId, topicId, difficulty, year: year ? parseInt(year) : undefined, search });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.QUESTION_MANAGER)
  @Post()
  create(@Body() dto: CreateQuestionDto, @CurrentUser() user) {
    return this.questionsService.create(dto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.QUESTION_MANAGER)
  @Post('bulk-import')
  bulkImport(@Body() dto: BulkImportDto, @CurrentUser() user) {
    return this.questionsService.bulkImport(dto.questions, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.QUESTION_MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
