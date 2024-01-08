export class ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  errors?: any;

  constructor(data: T, message: string, statusCode: number, errors?: any) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
