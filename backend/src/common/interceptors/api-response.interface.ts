export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  error: string | null;
  timestamp: number;
  version: string;
  path: string;
  data: T | null;
}
