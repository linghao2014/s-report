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
        let exists = yield Report.findOne({
            userId: this.state.userId,
            type: rData.type,
            'periodTime.year': rData.periodTime.year,
            'periodTime.month': rData.periodTime.month,
            'periodTime.date': rData.periodTime.date
        });
        if (exists) {
            this.body = {
                code: 421,
                msg: '请勿重复创建'
            };
            return;
        }
        try {
            rData.userId = this.state.userId;
            rData.createTime = Date.now();
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

router.get('/my', auth.mustLogin(), function* () {
    let list = yield Report.find({userId: this.state.userId}).sort({createTime: -1});
    this.body = {
        code: 200,
        list: list
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
    if (rp) {
        let trp = yield TeamReport.findOne({
            teamId: this.request.body.teamId,
            type: rp.type,
            'periodTime.year': rp.periodTime.year,
            'periodTime.month': rp.periodTime.month,
            'periodTime.date': rp.periodTime.date
        });
        if (!trp) {
            trp = new TeamReport({
                teamId: this.request.body.teamId,
                type: rp.type,
                periodTime: rp.periodTime,
                list: []
            });
        }
        if (_.find(trp.list, {id: rp.id})) {
            this.body = {
                code: 467,
                msg: '请勿重复发送'
            };
        } else {
            trp.list.push(rp);
            yield trp.save();
            this.body = {
                code: 200
            };
        }
    }
});

module.exports = router;