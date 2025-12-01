export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface ApiErrorType {
  code: number;
  message: string;
  data?: any;
}
