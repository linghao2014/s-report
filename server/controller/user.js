'use strict';
const router = require('koa-router')({prefix: '/user'});
const User = require('../model/user');
const thunkify = require('thunkify');
const logger = require('../lib/logger');
let passportLocalMongoose = require('passport-local-mongoose');

router.post('/login', function* () {
    console.log('login');
});

router.post('/register', function* () {
    let user = this.request.body;
    if (user.username && user.nickname && user.password) {
        try {
            user.createTime = Date.now();
            let result = yield thunkify(User.register).call(User, user, user.password);
            this.body = {
                code: 200
            };
            logger.info('New registed user', result);
        } catch (e) {
            if (e instanceof passportLocalMongoose.errors.UserExistsError) {
                this.body = {
                    code: 420,
                    msg: '该用户已注册'
                };
            } else {
                logger.error('Register fail', e);
            }
        }
    } else {
        this.body = {code: 410, msg: '参数不完整'};
    }
});

router.get('/get', function* () {
    this.body = {};
});

module.exports = router;