/**
 * 报告
 */
'use strict';
let helper = require('./helper');
let schema = helper.schema({
    userId: String,
    createTime: Number,
    updateTime: Number,
    type: String,
    periodTime: {year: Number, month: Number, date: Number, week: Number},
    content: [{text: String}],
    deleted: Boolean
});

schema.set('collection', 'reports');
module.exports = helper.model('Report', schema);