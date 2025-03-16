import { Role } from 'src/common/roles.enum';

//interface will be used for role guard since user can only have one role it becomes type safer and eaiser to fix the type safety

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName?: string; // Optional
  role: Role; // Single role
}
