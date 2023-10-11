import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, LoginDTO } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { salt_Rounds } from 'src/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(salt_Rounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  private generateAccessToken(
    id: number,
    role: string,
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const payload = {
      id,
      role,
      fullname: `${lastName} ${firstName}`,
    };
    return this.jwtService.signAsync(payload);
  }

  async signIn(requestData: CreateUserDTO): Promise<string | 1> {
    const existingRecord = await this.userRepository.find({
      where: [{ userName: requestData.userName }, { email: requestData.email }],
    });

    if (existingRecord.length != 0) {
      return 1;
    }

    const newUser = { ...requestData };

    newUser.password = await this.hashPassword(requestData.password);
    newUser.role = 'User';

    console.log('Role: ', newUser.role);

    const response = await this.userRepository.save(newUser);

    const access_token = this.generateAccessToken(
      response.id,
      response.role,
      response.lastName,
      response.firstName,
    );

    return access_token;
  }

  async login(requestData: LoginDTO) {
    let user: any;
    if (requestData.email) {
      user = await this.userRepository.findOneBy({
        email: requestData.email,
      });
    }

    if (requestData.userName) {
      user = await this.userRepository.findOneBy({
        userName: requestData.userName,
      });
    }

    if (!user) {
      return 1;
    }

    let checkPassword: boolean = await this.comparePasswords(
      requestData.password,
      user.password,
    );

    if (user && checkPassword) {
      return this.generateAccessToken(
        user.id,
        user.role,
        user.firstName,
        user.lastName,
      );
    } else {
      return 0;
    }
  }
}
