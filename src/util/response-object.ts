export class ResponseObject<T = unknown> {
  success: boolean;
  payload?: T;
  error?: string;

  constructor(success: boolean, data?: T, error?: string) {
    this.success = success;
    this.payload = data;
    this.error = error;
  }

  static success<U>(data?: U) {
    return new ResponseObject<U>(true, data);
  }

  static error(error: string) {
    return new ResponseObject<undefined>(false, undefined, error);
  }
}
