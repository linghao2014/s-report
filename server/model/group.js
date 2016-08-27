/**
 * 组织
 */
'use strict';
let helper = require('./helper');
let schema = helper.schema({
    name: String,
    createTime: Number
});

schema.set('collection', 'groups');
module.exports = helper.model('Group', schema);