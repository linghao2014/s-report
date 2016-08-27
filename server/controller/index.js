/**
 * api controller
 */
'use strict';
const router = require('koa-router')({prefix: '/api'});
const userController = require('./user');
const groupController = require('./group');
const teamController = require('./team');

module.exports.initialize = function (app) {
    router.use(userController.routes());
    router.use(groupController.routes());
    router.use(teamController.routes());
    app.use(router.routes());
};