import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
const path = require('path');

@Injectable()
export class FileHandlingService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuid()}${extname(file.originalname)}`;
    const dDrivePath = 'D:/';
    const customFolderPath = 'uploads/';
    const fullPath = `${dDrivePath}${customFolderPath}`;
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const filePath = `${dDrivePath}${customFolderPath}${fileName}`;

    fs.writeFileSync(filePath, file.buffer);

    return `${fileName}`;
  }

  async downloadFile(url: string): Promise<Buffer | null> {
    try {
      const filePath = 'D:/' + 'uploads/' + url;
      return fs.readFileSync(filePath);
    } catch (error) {
      return null;
    }
  }
}
