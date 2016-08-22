/**
 * server 入口
 */
'use strict';
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const Koa = require('koa');
const app = new Koa();
const auth = require('./lib/auth');
const controller = require('./controller');
const config = require('./config');
const logger = require('./lib/logger');

app.proxy = true;

app.use(bodyParser());

controller.initialize(app);

mongoose.connect(config.db.url);

mongoose.connection.once('open', function () {
    logger.info('Mongo opened');
    app.listen(config.server.listenPort, () => logger.info('Server listening on', config.server.listenPort));
});

mongoose.connection.once('error', err => logger.error('Mongo connect error ', err.message));
