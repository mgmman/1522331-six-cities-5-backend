import {UserType} from '../../../types';

export class CreateUserDto {
  public email: string;
  public avatarPath: string;
  public name: string;
  public password: string;
  public type: UserType;
}
