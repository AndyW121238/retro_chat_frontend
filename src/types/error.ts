import type { ApiErrorType } from "@/types/api";

export class ApiError extends Error implements ApiErrorType {
  code: number;
  data?: any;

  constructor(code: number, message: string, data?: any) {
    super(message);
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
