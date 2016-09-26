/**
 * 小组报告
 */
'use strict';
let helper = require('./helper');
let schema = helper.schema({
    teamId: String,
    createTime: Number,
    type: String,
    periodTime: {year: Number, month: Number, date: Number, week: Number},
    list: [{userId: String, content: [{text: String}]}]
});

schema.set('collection', 'team_reports');
module.exports = helper.model('TeamReport', schema);