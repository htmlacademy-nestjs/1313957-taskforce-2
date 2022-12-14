import {Injectable, Inject} from '@nestjs/common';
import {SiteUserRepository} from '../site-user/site-user.repository';
import {AUTH_USER_EXISTS, AUTH_USER_NOT_FOUND, AUTH_USER_PASSWORD_WRONG, AUTH_USER_BY_ID} from './auth.constant';
import {SiteUserEntity} from '../site-user/site-user.entity';
import {User} from '@taskforce/shared-types';
import {CreateUserDto} from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto';
import {ConfigType} from '@nestjs/config';
import databaseConfig from '../../config/database.config';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly siteUserRepository: SiteUserRepository,
    @Inject(databaseConfig.KEY)
    private readonly mongoConfig: ConfigType<typeof databaseConfig>,
  ) {
  }

  async register(dto: CreateUserDto) {
    const {name, email, role, dateBirth, city, password} = dto;
    const siteUser: User = {
      name, email, role, dateBirth: dayjs(dateBirth).toDate(), city, avatar: '', passwordHash: '', rating: 0
    };

    const existUser = await this.siteUserRepository
      .findByEmail(email);

    if (existUser) {
      throw new Error(AUTH_USER_EXISTS);
    }

    const userEntity = await new SiteUserEntity(siteUser).setPassword(password)

    return this.siteUserRepository
      .create(userEntity);
  }

  async login(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.siteUserRepository.findByEmail(email);

    if (!existUser) {
      throw new Error(AUTH_USER_NOT_FOUND);
    }

    const siteUserEntity = new SiteUserEntity(existUser);
    if (!await siteUserEntity.comparePassword(password)) {
      throw new Error(AUTH_USER_PASSWORD_WRONG);
    }

    return siteUserEntity.toObject();
  }

  async getUser(id: string) {
    const user = await this.siteUserRepository.findById(id);

    if (!user) {
      throw new Error(AUTH_USER_BY_ID);
    }

    return user;
  }
}
