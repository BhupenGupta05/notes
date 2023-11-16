const config = require('./utils/config.js');
const logger = require('./utils/logger.js');
const app = require('./app.js').default;

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});


