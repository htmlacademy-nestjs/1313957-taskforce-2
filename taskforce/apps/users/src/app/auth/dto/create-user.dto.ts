import {ApiProperty} from '@nestjs/swagger';
import {UserRole, UserCity} from '@taskforce/shared-types';

export class CreateUserDto {

  @ApiProperty({
    description: 'User name',
    example: 'Fox',
  })
  public name: string;

  @ApiProperty({
    description: 'User unique address',
    example: 'user@user.ru'
  })
  public email: string;

  @ApiProperty({
    description: 'User birth date',
    example: '1982-02-20',
  })
  public dateBirth: string;

  @ApiProperty({
    description: 'User city',
    example: 'Санкт-Петербург',
    enum: UserCity,
    required: true,
  })
  public city: UserCity;

  @ApiProperty({
    description: 'User role',
    example: 'customer'
  })
  public role: UserRole;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  public password: string;
}
