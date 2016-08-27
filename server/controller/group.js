/**
 * 组织api
 */
'use strict';
const _ = require('lodash');
const router = require('koa-router')({prefix: '/group'});
const User = require('../model/user');
const Group = require('../model/group');
const logger = require('../lib/logger');
const auth = require('../lib/auth');
const util = require('../lib/util');

function* injectGroup(next) {
    let user = yield User.findById(this.state.userId).exec();
    let group = user.groupId && (yield Group.findById(user.groupId).exec());
    if (!group) {
        this.body = {code: 404};
    } else {
        let admin = _.find(group.members, {userId: user.id, admin: true});
        if (!admin) {
            this.body = {code: 411, msg: '不是管理员'};
        } else {
            this.state.group = group;
            yield next;
        }
    }
}

router.post('/create', auth.mustLogin(), function* () {
    let name = this.request.body.name;
    if (!name) {
        this.body = {code: 400, msg: '组织名不能为空'};
        return;
    }
    let group = new Group({
        name: name,
        createTime: Date.now(),
        members: [{userId: this.state.userId, admin: true}]
    });
    yield group.save();
    let user = yield User.findById(this.state.userId).exec();
    user.groupId = group.id;
    yield user.save();
    this.body = {
        code: 200,
        group: group
    };
});

router.get('/get', auth.mustLogin(), injectGroup, function* () {
    let group = this.state.group;
    let ids = [];
    let admins = {};
    group.members.forEach(m => {
        ids.push(m.userId);
        m.admin && (admins[m.userId] = true);
    });
    let members = yield User.find({_id: {$in: ids}}).exec();
    this.body = {
        code: 200,
        info: group,
        members: members.map(m => {
            let obj = m.toObject();
            obj.admin = !!admins[m.id];
            return obj;
        })
    };
});

router.post('/update', auth.mustLogin(), injectGroup, function* () {
    let name = this.request.body.name;
    let ret = {};
    if (name) {
        let group = this.state.group;
        group.name = name;
        yield group.save();
        ret.code = 200;
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

router.post('/addMember', auth.mustLogin(), injectGroup, function* () {
    let mail = this.request.body.mail;
    let ret = {};
    if (mail) {
        let group = this.state.group;
        let user = yield User.findOne({username: mail});
        if (user) {
            if (!user.groupId) {
                user.groupId = group.id;
                yield group.update({$push: {members: {userId: user.id, admin: false}}}).exec();
                yield user.save();
                ret.code = 200;
                ret.user = user;
            } else {
                ret.code = 417;
                ret.msg = '添加出错,该用户已选择组织';
            }
        } else {
            ret.code = 416;
            ret.msg = '用户不存在';
        }
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

router.post('/delMember', auth.mustLogin(), injectGroup, function* () {
    let memberId = this.request.body.id;
    let ret = {};
    if (memberId) {
        let group = this.state.group;
        let user = yield User.findById(memberId);
        yield group.update({$pull: {members: {userId: user.id}}}).exec();
        if (user) {
            user.groupId = null;
            yield user.save();
        }
        ret.code = 200;
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

module.exports = router;