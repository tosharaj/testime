import { Module } from '@nestjs/common';
import { NcertController } from './ncert.controller';
import { NcertService } from './ncert.service';

@Module({
  controllers: [NcertController],
  providers: [NcertService],
  exports: [NcertService],
})
export class NcertModule {}
