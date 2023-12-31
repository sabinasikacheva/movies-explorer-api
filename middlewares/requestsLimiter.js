const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Слишком много запросов, повторите попытку позже' },
});

module.exports = limiter;
