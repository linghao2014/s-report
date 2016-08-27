/**
 * 组织api
 */
'use strict';
const router = require('koa-router')({prefix: '/group'});
const User = require('../model/user');
const Group = require('../model/group');
const logger = require('../lib/logger');
const auth = require('../lib/auth');
const util = require('../lib/util');

router.post('/create', auth.mustLogin(), function* () {
    let name = this.request.body.name;
    if (!name) {
        this.body = {code: 400, msg: '组织名不能为空'};
        return;
    }
    try {
        let group = new Group({
            name: name,
            createTime: Date.now()
        });
        yield group.save();
        let user = yield User.findById(this.userId).exec();
        user.groupId = group.id;
        yield user.save();
        this.body = {
            code: 200,
            group: group
        };

    } catch (e) {
        this.body = {
            code: 500
        };
        logger.error('登录出错', e);
    }
});


module.exports = router;