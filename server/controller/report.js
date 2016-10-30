/**
 * 组织api
 */
'use strict';
const _ = require('lodash');
const router = require('koa-router')({prefix: '/report'});
const User = require('../model/user');
const Group = require('../model/group');
const Team = require('../model/team');
const Report = require('../model/report');
const TeamReport = require('../model/teamReport');
const logger = require('../lib/logger');
const auth = require('../lib/auth');
const util = require('../lib/util');

router.post('/create', auth.mustLogin(), function* () {
    let rData = this.request.body.report;
    if (!rData || !rData.content || !rData.type || !rData.periodTime) {
        this.body = {
            code: 400
        };
    } else {
        try {
            rData.userId = this.state.userId;
            let report = new Report(rData);
            yield report.save();
            this.body = {
                code: 200,
                report: report
            };
        } catch (e) {
            this.body = {
                code: 500
            };
            logger.error('创建报告异常', e.message);
        }
    }
});

router.post('/update', auth.mustLogin(), function* () {
    let rData = this.request.body.report;
    if (!rData || !rData.id || !rData.content || !rData.type || !rData.periodTime) {
        this.body = {
            code: 400
        };
    } else {
        try {
            let report = yield Report.findById(rData.id);
            if (!report) {
                this.body = {
                    code: 404
                };
            }
            report.type = rData.type;
            report.content = rData.content;
            report.periodTime = rData.periodTime;
            yield report.save();
            this.body = {
                code: 200
            };
        } catch (e) {
            this.body = {
                code: 500
            };
            logger.error('创建报告异常', e.message);
        }
    }
});

router.get('/my', auth.mustLogin(), function* () {
    let list = yield Report.find({userId: this.state.userId}).sort({createTime: -1});
    this.body = {
        code: 200,
        list: list
    };
});

router.get('/team', auth.mustLogin(), function* () {
    let userId = this.state.userId;
    let teams = yield Team.find({members: {$elemMatch: {userId: userId}}}).exec();
    let followTeams = yield Team.find({follows: {$elemMatch: {userId: userId}}}).exec();
    let teamMap = {};
    let userMap = {};
    let teamIds = [];
    teams.concat(followTeams).forEach(t => {
        teamMap[t.id] = t;
        teamIds.push(t.id);
    });
    let list = yield TeamReport.find({teamId: {$in: teamIds}}).sort({createTime: -1});
    list.forEach(l => {
        l.list.forEach(r => {
            userMap[r.userId] = true;
        });
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

router.get('/delete', auth.mustLogin(), function* () {
    let rp = yield Report.findById(this.request.query.id);
    if (rp) {
        if (rp.userId == this.state.userId) {
            yield rp.remove();
            this.body = {
                code: 200
            };
        } else {
            this.body = {
                code: 433,
                msg: '没有权限'
            };
        }
    } else {
        this.body = {
            code: 404
        };
    }
});

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

module.exports = router;