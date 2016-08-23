/**
 * api controller
 */
'use strict';
const router = require('koa-router')({prefix: '/api'});
const userController = require('./user');

module.exports.initialize = function (app) {
    router.use(userController.routes());
    app.use(router.routes());
};