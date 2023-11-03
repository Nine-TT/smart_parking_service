import { Module } from '@nestjs/common';
import { FileHandlingService } from './fileHandle.service';
import { FileHandlingController } from './fileHandle.controller';

@Module({
  providers: [FileHandlingService],
  controllers: [FileHandlingController],
})
export class FileHandlingModule {}
