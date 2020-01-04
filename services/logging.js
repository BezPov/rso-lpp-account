const winston = require('winston');

require('winston-logstash');

try {
    const logitData = require('../config/logit-io-config.json');

    winston.add(winston.transports.Logstash, logitData);
} catch (ex) {
    console.log(ex);
}

module.exports = winston;