export class UserResponseDto {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  //? for later usage when implementing tasks associated
  /*   tasks?: {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate?: string;
  }[]; */
}
