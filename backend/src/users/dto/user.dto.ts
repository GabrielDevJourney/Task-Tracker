import { Role } from 'src/common/roles.enum';

export interface UserDto {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
