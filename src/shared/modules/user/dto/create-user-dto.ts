import {UserType} from '../../../types';
import {IsEmail, IsEnum, IsString, Length, Matches} from 'class-validator';
import {userValidations} from './user-validations.js';

export class CreateUserDto {
  @IsEmail({}, { message: userValidations.email.invalidFormat })
  public email: string;

  @Matches(/\.(jpg|png)$/i, { message: userValidations.avatarPath.invalidFormat })
  public avatar?: string;

  @IsString({ message: userValidations.firstname.invalidFormat })
  @Length(1, 15, { message: userValidations.firstname.lengthField })
  public name: string;

  @IsString({ message: userValidations.password.invalidFormat })
  @Length(6, 12, { message: userValidations.password.lengthField })
  public password: string;

  @IsEnum(UserType, { message: userValidations.type.invalidFormat })
  public type: UserType;
}
