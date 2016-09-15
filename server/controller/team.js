/**
 * 组织api
 */
'use strict';
const _ = require('lodash');
const router = require('koa-router')({prefix: '/team'});
const User = require('../model/user');
const Group = require('../model/group');
const Team = require('../model/team');
const logger = require('../lib/logger');
const auth = require('../lib/auth');
const util = require('../lib/util');

function* injectTeam(next) {
    let teamId = this.request.body.teamId || this.request.query.teamId;
    let team = teamId && (yield Team.findById(teamId).exec());
    if (!team) {
        this.body = {code: 404};
    } else {
        let admin = _.find(team.members, {userId: this.state.userId, admin: true});
        if (!admin) {
            this.body = {code: 411, msg: '不是管理员'};
        } else {
            this.state.team = team;
            yield next;
        }
    }
}

router.post('/create', auth.mustLogin(), function* () {
    let name = this.request.body.name;
    let canBeFollow = this.request.body.canBeFollow;
    if (!name) {
        this.body = {code: 400, msg: '组名不能为空'};
        return;
    }
    let user = yield User.findById(this.state.userId).exec();
    let team = new Team({
        name: name,
        groupId: user.groupId,
        createTime: Date.now(),
        canBeFollow: canBeFollow,
        members: [{userId: this.state.userId, admin: true}]
    });
    yield team.save();
    this.body = {
        code: 200,
        group: team
    };
});

router.get('/get', auth.mustLogin(), injectTeam, function* () {
    let team = this.state.team;
    let ids = [];
    let admins = {};
    team.members.forEach(m => {
        ids.push(m.userId);
        m.admin && (admins[m.userId] = true);
    });
    let members = yield User.find({_id: {$in: ids}}).exec();
    let follows = yield User.find({_id: {$in: team.follows.map(m => m.userId)}});
    this.body = {
        code: 200,
        info: team,
        follows: follows,
        members: members.map(m => {
            let obj = m.toObject();
            obj.admin = !!admins[m.id];
            return obj;
        })
    };
});

router.post('/update', auth.mustLogin(), injectTeam, function* () {
    let team = this.state.team;
    let name = this.request.body.name;
    let mails = this.request.body.mails;
    let canBeFollow = this.request.body.canBeFollow;
    let ret = {};
    name !=null && (team.name = name);
    mails !=null && (team.mails = mails);
    canBeFollow !=null && (team.canBeFollow = canBeFollow);
    yield team.save();
    ret.code = 200;
    this.body = ret;
});

router.get('/delete', auth.mustLogin(), injectTeam, function* () {
    yield this.state.team.remove();
    this.body = {code: 200};
});

router.post('/addMember', auth.mustLogin(), injectTeam, function* () {
    let ids = this.request.body.ids;
    let ret = {};
    if (ids) {
        let team = this.state.team;
        let newMembers = ids.filter(id => !_.find(team.members, {userId: id})).map(id => {
            return {userId: id, admin: false};
        });
        if(newMembers.length) {
            Array.prototype.push.apply(team.members, newMembers);
            yield team.save();
        }
        ret.code = 200;
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

router.post('/delMember', auth.mustLogin(), injectTeam, function* () {
    let userId = this.request.body.userId;
    let ret = {};
    if (userId) {
        let team = this.state.team;
        yield team.update({$pull: {members: {userId: userId}}}).exec();
        ret.code = 200;
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

router.post('/updateRole', auth.mustLogin(), injectTeam, function* () {
    let userId = this.request.body.userId;
    let admin = this.request.body.admin;
    let ret = {};
    if (userId && admin != null) {
        let team = this.state.team;
        let member = _.find(team.members, {userId: userId});
        if (member) {
            member.admin = admin;
            yield team.save();
            ret.code = 200;
        } else {
            ret.code = 418;
            ret.msg = '用户不存在';
        }
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

router.get('/myList', auth.mustLogin(), function* () {
    let userId = this.state.userId;
    let teams = yield Team.find({members: {$elemMatch: {userId: userId}}}).exec();
    this.body = {
        code: 200,
        teams: teams.map(team => {
            let obj = team.toObject();
            obj.memberSize = team.members.length;
            obj.followSize = team.follows.length;
            obj.admin = _.find(team.members, {userId: userId, admin: true});
            return obj;
        })
    };
});

router.get('/followList', auth.mustLogin(), function* () {
    let userId = this.state.userId;
    let teams = yield Team.find({follows: {$elemMatch: {userId: userId}}}).exec();
    this.body = {
        code: 200,
        teams: teams.map(team => {
            let obj = team.toObject();
            obj.memberSize = team.members.length;
            obj.followSize = team.follows.length;
            return obj;
        })
    };
});

router.get('/all', auth.mustLogin(), function*() {
    let user = yield User.findById(this.state.userId).exec();
    let teams = yield Team.find({groupId: user.groupId}).exec();
    this.body = {
        code: 200,
        teams: teams.map(team => {
            let obj = team.toObject();
            obj.memberSize = team.members.length;
            obj.followSize = team.follows.length;
            obj.admin = !!_.find(team.members, {userId: user.id, admin: true});
            obj.followed = team.canBeFollow && !!_.find(team.follows, {userId: user.id});
            return obj;
        })
    };
});

router.get('/follow', auth.mustLogin(), function*() {
    let ret = {};
    if (this.request.query.teamId && this.request.query.follow) {
        let team = yield Team.findById(this.request.query.teamId).exec();
        if (team) {
            if (team.canBeFollow) {
                let cdt = {follows: {userId: this.state.userId}};
                yield team.update(this.request.query.follow == 'true' ? {$push: cdt} : {$pull: cdt}).exec();
                ret.code = 200;
            } else {
                ret.code = 401;
                ret.meg = '该小组不允许关注';
            }
        } else {
            ret.code = 404;
            ret.msg = '小组不存在';
        }
    } else {
        ret.code = 400;
    }
    this.body = ret;
});

module.exports = router;