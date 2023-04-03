const rateLimit = require('express-rate-limit');

module.exports.REQUEST_LIMITER_OPTIONS = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2000, // 200 reqs per 5 min
  standardHeaders: true,
  legacyHeaders: false,
});
