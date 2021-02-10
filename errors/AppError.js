class AppError {
  constructor(statusCode = 400) {
    this.statusCode = statusCode;
  }
}

export default AppError;
