/**
 * 用户api
 */
'use strict';
const router = require('koa-router')({prefix: '/user'});
const User = require('../model/user');
const thunkify = require('thunkify');
const logger = require('../lib/logger');
const passportLocalMongoose = require('passport-local-mongoose');
const auth = require('../lib/auth');
const util = require('../lib/util');

router.post('/login', function* () {
    let user = this.request.body;
    try {
        let result = yield thunkify(auth.authenticate)(user.username, user.password);
        if (result && result.id) {
            auth.login(this, result);
            this.body = {
                code: 200,
                user: result
            };
        } else {
            this.body = {
                code: 401
            };
        }
    } catch (e) {
        this.body = {
            code: 500
        };
        logger.error('登录出错', e);
    }
});

router.post('/register', function* () {
    let user = this.request.body;
    if (user.username && user.nickname && user.password) {
        if (!util.isMail(user.username)) {
            this.body = {code: 411, meg: '邮箱格式不正确'};
            return;
        }
        try {
            user.createTime = Date.now();
            let result = yield thunkify(User.register).call(User, user, user.password);
            auth.login(this, result);
            this.body = {
                code: 200
            };
            logger.info('新注册用户', result);
        } catch (e) {
            if (e instanceof passportLocalMongoose.errors.UserExistsError) {
                this.body = {
                    code: 420,
                    msg: '该用户已注册'
                };
            } else {
                logger.error('注册失败', e);
            }
        }
    } else {
        this.body = {code: 410, msg: '参数不完整'};
    }
});

router.get('/logout', function* () {
    this.cookies.set('s_key', '', {expires: new Date(0)});
    this.body = {code: 200};
});

router.post('/find', function*() {
    let mail = this.request.body.mail;
    if (util.isMail(mail)) {
        let user = yield User.findByUsername(mail);
        if (user) {
            try {
                yield util.sendMail({to: mail, html: 'test', subject: '找回密码'});
                this.body = {code: 200};
            } catch(e) {
                console.log(e);
                this.body = {code: 510, msg: '邮件发送失败'};
            }
        } else {
            this.body = {code: 410, msg: '该帐号未注册'};
        }
    } else {
        this.body = {code: 400, msg: '邮箱格式不正确'}
    }

});

module.exports = router;