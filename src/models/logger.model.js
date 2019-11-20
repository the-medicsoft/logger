const { model } = require("mongoose");
const BaseModel = require('@the-medicsoft/webapi-framework/lib/models/BaseModel');
const { LoggerSchema } = require('../schemas/logger.schema');

class LoggerModel extends BaseModel {
    constructor() {
        super(model('log', LoggerSchema));
    }

    async createLog(req, res, payload) {
        const reqHeaders = req.headers;
        const payLoad = JSON.parse(payload);

        const log = {
            reqId: req.id,
            ip: req.ip,
            hostName: req.hostname,
            method: req.raw.method,
            url: req.raw.url,
            httpCode: res.statusCode,
            httpStatusText: payLoad.statusText || payLoad.statusMessage,
            logLevel: payLoad.logLevel,
            query: JSON.stringify(req.query),
            params: JSON.stringify(req.params),
            body: req.body,
            resPayload: payLoad,
            message: payLoad.message,
            reqHeaders
        };

        await super.create({ body: log });
    }
}

module.exports = { LoggerModel };