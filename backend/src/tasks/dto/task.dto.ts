export interface TaskDto {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}
