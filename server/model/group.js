/**
 * 组织
 */
'use strict';
let helper = require('./helper');
let schema = helper.schema({
    name: String,
    members: [{userId: String, admin: Boolean}]
}, {ignores: 'members'});

schema.set('collection', 'groups');
module.exports = helper.model('Group', schema);