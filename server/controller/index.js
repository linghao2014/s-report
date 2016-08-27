/**
 * api controller
 */
'use strict';
const router = require('koa-router')({prefix: '/api'});
const userController = require('./user');
const groupController = require('./group');

module.exports.initialize = function (app) {
    router.use(userController.routes());
    router.use(groupController.routes());
    app.use(router.routes());
};