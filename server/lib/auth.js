/**
 * 用户验证相关
 */
'use strict';
const User = require('../model/user');
const util = require('./util');

const maxAge = 7 * 24 * 3600 * 1000;

module.exports.authenticate = User.authenticate();

module.exports.login = function (ctx, user) {
    let keyData = {
        userId: user.id,
        username: user.username,
        expires: Date.now() + maxAge,
        ip: ctx.request.ip
    };
    ctx.cookies.set('s_key', util.encrypt(JSON.stringify(keyData)), {
        expires: new Date(keyData.expires),
        httpOnly: true
    });
};