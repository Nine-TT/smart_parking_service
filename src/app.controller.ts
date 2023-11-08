import { Controller, Get, Param, Query, Inject, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadFile } from './util/upload-file';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(UploadFile)
    private readonly uploadFile: UploadFile,
  ) {}

  @Get('image')
  @ApiQuery({ name: 'url', type: String })
  async downloadImage(@Query('url') url: string, @Res() res: Response) {
    const filePath = process.env.PATH_ROOT + url;
    const imageBuffer = await this.uploadFile.downloadFile(url);

    if (imageBuffer) {
      res.download(filePath);
    } else {
      res.status(404).send('Image not found');
    }
  }
}
