import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Post,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileHandlingService } from './fileHandle.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Response } from 'express';

@Controller('files')
export class FileHandlingController {
  constructor(private FileHandlingService: FileHandlingService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.FileHandlingService.uploadFile(file);
    return { url };
  }

  @Get('download/:url')
  async downloadImage(@Param('url') url: string, @Res() res: Response) {
    const filePath = 'D:/' + 'uploads/' + url;
    const imageBuffer = await this.FileHandlingService.downloadFile(url);
    if (imageBuffer) {
      res.download(filePath);
    } else {
      res.status(404).send('Image not found');
    }
  }
}
