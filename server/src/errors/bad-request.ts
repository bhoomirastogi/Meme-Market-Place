import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api";

class BadRequestError extends CustomApiError {
  statusCodes: number;
  constructor(message: string) {
    super(message);
    this.statusCodes = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
