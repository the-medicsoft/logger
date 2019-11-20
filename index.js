const { HttpCode } = require("@the-medicsoft/webapi-framework/lib/helpers");
const { LoggerModel } = require("./src/models/logger.model");

// Logger Plugin
module.exports = (fastify, option, done) => {
  requestLogger(fastify);
  responseLogger(fastify);
};

function requestLogger(server) {
  server.addHook("onRequest", (req, res, done) => {
    done();
  });
}

async function responseLogger(server) {
  server.addHook("onSend", async (req, res, payload) => {
    // log only those requests & responses for which Server/DB throws Error
    const logger = new LoggerModel();

    try {
      if (
        res.statusCode !== HttpCode[200].code &&
        res.statusCode !== HttpCode[201].code
      ) {
        await logger.createLog(req, res, payload);
      }
    } catch (err) {
      await logger.createLog(req, res, payload);
    }
  });
}
