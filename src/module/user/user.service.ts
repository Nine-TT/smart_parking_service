import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/user.dto';
import { Repository, Equal } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { userRole } from 'src/constants';
import { UploadFile } from 'src/util/upload-file';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(UploadFile)
    private readonly uploadFile: UploadFile,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async createUser(requestData: CreateUserDTO): Promise<any> {
    const existingRecord = await this.userRepository.find({
      where: [{ userName: requestData.userName }, { email: requestData.email }],
    });

    if (existingRecord.length != 0) {
      return 1;
    }

    if (existingRecord) {
      return 1;
    }

    // Tạo một bản sao của requestData để tránh thay đổi dữ liệu gốc
    const newUser = { ...requestData };

    newUser.password = await this.hashPassword(requestData.password);
    newUser.role = newUser.role ? newUser.role : userRole.user;

    const response = await this.userRepository.save(newUser);

    return response;
  }

  async updateUser(responseData: CreateUserDTO, id: number): Promise<number> {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      return 0;
    }

    const response = await this.userRepository.update(id, {
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      phoneNumber: responseData.phoneNumber,
    });

    return response.affected;
  }

  async deleteUSerById(ids: number | number[]): Promise<number> {
    const userIds = Array.isArray(ids) ? ids : [ids];

    const deleteResult = await this.userRepository.delete(userIds);

    const deletedCount = deleteResult.affected;
    return deletedCount;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (user) {
      return user;
    } else {
      return 0;
    }
  }

  async getUsersWithCount({ page, pageSize }) {
    const skip = (page - 1) * pageSize;
    const [users, count] = await this.userRepository.findAndCount({
      where: {
        role: Equal(userRole.user),
      },
      skip,
      take: pageSize,
    });

    const userData = {
      users: users,
      count: count,
    };

    return userData;
  }

  async getUsersWithCountRoleManager({ page, pageSize }) {
    const skip = (page - 1) * pageSize;
    const [users, count] = await this.userRepository.findAndCount({
      where: {
        role: Equal(userRole.manager),
      },
      skip,
      take: pageSize,
    });

    const userData = {
      users: users,
      count: count,
    };

    return userData;
  }

  async updateAvatar(
    file: Express.Multer.File,
    folderName: string,
    userId: number,
  ) {
    try {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });

      if (user) {
        const imgUrl = await this.uploadFile.uploadFile(file, folderName);
        user.imageUrl = imgUrl;
        await this.userRepository.save(user);

        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }
}
