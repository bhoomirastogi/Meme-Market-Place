import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api";

class UnAuthorised extends CustomApiError {
  statusCodes: number;
  constructor(message: string) {
    super(message);
    this.statusCodes = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthorised;
