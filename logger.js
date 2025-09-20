 // middleware/logger.js
function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[LOG] ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });
  next();
}

// 👇 Export the function directly
module.exports = logger;
