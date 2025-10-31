import {IsEmail, IsString} from 'class-validator';
import {userValidations} from './user-validations.js';

export class LoginUserDto {
  @IsEmail({}, { message: userValidations.email.invalidFormat })
  public email: string;

  @IsString({ message: userValidations.password.invalidFormat })
  public password: string;
}
