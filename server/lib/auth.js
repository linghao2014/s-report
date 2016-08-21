/**
 * 用户验证相关
 */
'use strict';
const passport = require('koa-passport');
const User = require('../model/user');

module.exports.initialize = function () {
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};