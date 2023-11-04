import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
const path = require('path');
import 'dotenv/config';

export class UploadFile {
  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    const fileName = `${uuid()}${extname(file.originalname)}`;
    const dDrivePath = process.env.PATH_ROOT;
    const customFolderPath = `${folderName}/`;
    const fullPath = `${dDrivePath}${customFolderPath}`;
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const filePath = `${dDrivePath}${customFolderPath}${fileName}`;

    fs.writeFileSync(filePath, file.buffer);

    return `${folderName}/${fileName}`;
  }

  async downloadFile(url: string): Promise<Buffer | null> {
    try {
      const filePath = process.env.PATH_ROOT + url;

      console.log(filePath);
      return fs.readFileSync(filePath);
    } catch (error) {
      return null;
    }
  }
}
