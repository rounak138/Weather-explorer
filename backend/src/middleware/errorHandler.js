export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error('Server error:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}
