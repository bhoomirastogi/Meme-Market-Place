import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api";

class NotFoundError extends CustomApiError {
  statusCodes: number;
  constructor(message: string) {
    super(message);
    this.statusCodes = StatusCodes.NOT_FOUND;
  }
}
