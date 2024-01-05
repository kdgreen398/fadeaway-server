export class ResponseObject {
  success: boolean;
  data?: any;
  error?: string;

  constructor(success: boolean, data?: any, error?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data: any) {
    return new ResponseObject(true, data);
  }

  static error(error: string) {
    return new ResponseObject(false, undefined, error);
  }
}
