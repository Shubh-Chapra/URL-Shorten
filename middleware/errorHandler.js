module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // For logging (only in dev)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
};
