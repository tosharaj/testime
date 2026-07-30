import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { CreateTestDto, UpdateTestDto, AddQuestionsDto } from './dto/tests.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Tests')
@Controller('tests')
export class TestsController {
  constructor(private testsService: TestsService) {}

  @Public()
  @Get()
  findAll(@Query() query: PaginationDto, @Query('examId') examId?: string, @Query('testType') testType?: string, @Query('isFree') isFree?: string) {
    return this.testsService.findAll(query, { examId, testType, isFree: isFree === 'true' });
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.testsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEST_MANAGER)
  @Post()
  create(@Body() dto: CreateTestDto) {
    return this.testsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEST_MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEST_MANAGER)
  @Post(':id/questions')
  addQuestions(@Param('id') id: string, @Body() dto: AddQuestionsDto) {
    return this.testsService.addQuestions(id, dto.questionIds);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}
