function globalErrorHandler(err, req, res, next) {
  console.error("Error: ", err);

  // Handle operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Handle programming or unknown errors
  res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong!",
  });

  // Terminate the process for programming errors in production
  if (!err.isOperational) {
    process.exit(1);
  }
}

export default globalErrorHandler;
