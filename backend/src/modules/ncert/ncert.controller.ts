import { Controller, Get, Post, Patch, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NcertService } from './ncert.service';
import {
  CreateNcertBookDto,
  UpdateNcertBookDto,
  CreateNcertChapterDto,
  UpdateNcertChapterDto,
  LinkNcertChapterDto,
} from './ncert.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('NCERT')
@Controller('ncert')
export class NcertController {
  constructor(private ncertService: NcertService) {}

  @Public()
  @Get('books')
  findBooks(@Query('class') cls?: string, @Query('includeChapters') includeChapters?: string) {
    const parsed = cls !== undefined && cls !== '' ? parseInt(cls, 10) : undefined;
    return this.ncertService.findBooks(parsed, includeChapters === 'true' || includeChapters === '1');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR, UserRole.QUESTION_MANAGER)
  @Post('books')
  createBook(@Body() dto: CreateNcertBookDto) {
    return this.ncertService.createBook(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR)
  @Patch('books/:id')
  updateBook(@Param('id') id: string, @Body() dto: UpdateNcertBookDto) {
    return this.ncertService.updateBook(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete('books/:id')
  deleteBook(@Param('id') id: string) {
    return this.ncertService.deleteBook(id);
  }

  @Public()
  @Get('chapters')
  findChapters(@Query('bookId') bookId?: string) {
    return this.ncertService.findChapters(bookId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR, UserRole.QUESTION_MANAGER)
  @Post('chapters')
  createChapter(@Body() dto: CreateNcertChapterDto) {
    return this.ncertService.createChapter(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR)
  @Patch('chapters/:id')
  updateChapter(@Param('id') id: string, @Body() dto: UpdateNcertChapterDto) {
    return this.ncertService.updateChapter(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete('chapters/:id')
  deleteChapter(@Param('id') id: string) {
    return this.ncertService.deleteChapter(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR, UserRole.QUESTION_MANAGER)
  @Get('chapters/:id/links')
  getLinks(@Param('id') id: string) {
    return this.ncertService.getChapterLinks(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR, UserRole.QUESTION_MANAGER)
  @Put('chapters/:id/links')
  setLinks(@Param('id') id: string, @Body() dto: LinkNcertChapterDto) {
    return this.ncertService.setChapterLinks(id, dto);
  }
}
