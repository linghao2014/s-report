/**
 * 简报
 */
'use strict';
const _ = require('lodash');
const router = require('koa-router')({prefix: '/report'});
const User = require('../model/user');
const Team = require('../model/team');
const Report = require('../model/report');
const TeamReport = require('../model/teamReport');
const logger = require('../lib/logger');
const auth = require('../lib/auth');
const util = require('../lib/util');
const config = require('../config');
const BusinessError = require('../error/BusinessError');
const ErrCode = BusinessError.ErrCode;
/**
 * 新建简报
 */
router.post('/create', auth.mustLogin(), function* () {
    let rData = this.request.params.report;
    if (!rData || !rData.content || !rData.type || !rData.periodTime) {
        throw new BusinessError(ErrCode.ABSENCE_PARAM);
    }
    rData.userId = this.state.userId;
    let report = new Report(rData);
    yield report.save();
    this.body = {
        code: 200,
        report: report
    };
});
/**
 * 更新
 */
router.post('/update', auth.mustLogin(), function* () {
    let rData = this.request.params.report;
    if (!rData || !rData.id || !rData.content || !rData.type || !rData.periodTime) {
        throw new BusinessError(ErrCode.ABSENCE_PARAM);
    }
    let report = yield Report.findById(rData.id);
    if (!report) {
        throw new BusinessError(ErrCode.NOT_FIND);
    }
    report.type = rData.type;
    report.content = rData.content;
    report.periodTime = rData.periodTime;
    yield report.save();
    this.body = {
        code: 200
    };
});
/**
 * 我的简报
 */
router.get('/my', auth.mustLogin(), function* () {
    let params = this.request.params;
    let list = yield Report.find({userId: this.state.userId})
        .sort({updateTime: -1})
        .skip(parseInt(params.offset) || 0)
        .limit(parseInt(params.limit) || 15);
    this.body = {
        code: 200,
        list: list
    };
});
/**
 * 小组简报
 */
router.get('/team', auth.mustLogin(), function* () {
    let params = this.request.params;
    let userId = this.state.userId;
    // 我所在的小组
    let teams = yield Team.find({members: {$elemMatch: {userId: userId}}}).exec();
    // 我关注的小组
    let followTeams = yield Team.find({follows: {$elemMatch: {userId: userId}}}).exec();
    let teamMap = {};
    let userMap = {};
    let teamIds = [];
    // 建立所有小组的k-v查询,以后面使用
    teams.concat(followTeams).forEach(t => {
        teamMap[t.id] = t;
        teamIds.push(t.id);
    });
    // 查找小组日报
    let list = yield TeamReport.find({teamId: {$in: teamIds}})
        .sort({createTime: -1})
        .skip(parseInt(params.offset) || 0)
        .limit(parseInt(params.limit) || 15);
    list = list.filter(x => x.list && x.list.length).map(x => x.toObject());
    list.forEach(l => {
        let team = teamMap[l.teamId];
        let notSend = team.members.map(u => u.userId);
        l.admin = !!_.find(team.members, {userId: userId, admin: true});
        l.list.forEach(r => {
            userMap[r.userId] = true;
            // 将已发送的从not send里剔除
            let index = notSend.indexOf(r.userId);
            if (index >= 0) {
                notSend.splice(index, 1);
            }
        });
        notSend.forEach(uid => userMap[uid] = true);
        l.notSend = notSend;
    });
    let users = yield User.find({_id: {$in: Object.keys(userMap)}});
    users.forEach(u => {
        userMap[u.id] = u;
    });
    this.body = {
        code: 200,
        list: list,
        teamMap: teamMap,
        userMap: userMap
    };
});
/**
 * 删除简报
 */
router.get('/delete', auth.mustLogin(), function* () {
    let rp = yield Report.findById(this.request.query.id);
    if (!rp) throw new BusinessError(ErrCode.NOT_FIND);
    if (rp.userId != this.state.userId) {
        throw new BusinessError(433, '没有权限');
    }
    yield rp.remove();
    if (rp.toTeam && rp.toTeam.teamReportId) {
        let teamReport = yield TeamReport.findById(rp.toTeam.teamReportId);
        let index = _.findIndex(teamReport.list, {reportId: rp.id});
        if (index >= 0) {
            teamReport.list.splice(index, 1);
            yield teamReport.save();
        }
    }
    this.body = {
        code: 200
    };
});
/**
 * 发送简报
 */
router.post('/send', auth.mustLogin(), function* () {
    let rp = yield Report.findById(this.request.body.reportId);
    let team = yield Team.findById(this.request.body.teamId);
    if (rp && team) {
        let trp = yield TeamReport.findOne({
            teamId: this.request.body.teamId,
            periodDesc: rp.periodDesc
        });
        if (!trp) {
            trp = new TeamReport({
                teamId: this.request.body.teamId,
                type: rp.type,
                periodDesc: rp.periodDesc,
                list: []
            });
        }
        let send = _.find(trp.list, {userId: rp.userId});
        if (send) {
            send.reportId = rp.id;
            send.content = rp.content;
        } else {
            trp.list.push({
                userId: rp.userId,
                reportId: rp.id,
                content: rp.content
            });
        }
        rp.toTeam = {teamId: team.id, teamName: team.name, teamReportId: trp.id};
        yield rp.save();
        yield trp.save();
        this.body = {
            code: 200,
            toTeam: rp.toTeam
        };
    }
});
/**
 * 将小组简报邮件抄送
 */
router.get('/sendMail', auth.mustLogin(), function *() {
    let params = this.request.params;
    if (!params.teamReportId) throw new BusinessError(ErrCode.ABSENCE_PARAM);
    let teamReport = yield TeamReport.findById(params.teamReportId);
    if (!teamReport) throw new BusinessError(ErrCode.NOT_FIND);
    if (!teamReport.list || !teamReport.list.length) throw new BusinessError(416, '暂无简报');
    let team = yield Team.findById(teamReport.teamId);
    if (!team) throw new BusinessError(417, '小组不存在');
    if (!_.find(team.members, {admin: true, userId: this.state.userId})) {
        throw new BusinessError(409, '无操作权限');
    }
    let userIds = teamReport.list.map(x => x.userId);
    let users = yield User.find({id: {$in: userIds}}).exec();
    users = users.map(u => u.toObject());
    let list = teamReport.list.map(x => x.toObject());
    list.forEach(x => {
        x.user = _.find(users, {id: x.userId}) || {};
    });
    let cc = users.map(x => x.workMail).concat(team.mails.split(/(,|;)/)).filter(x => !!x);
    let html = yield this.render('mail', {list: list, writeResp: false});
    util.sendMail({
        from: `"${this.state.loginUser.nickname}" <${config.mail.auth.user}>`,
        cc: cc.join(','),
        html: html
    });
    this.body = {code: 200};
});

module.exports = router;