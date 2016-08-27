/**
 * 用户
 */
'use strict';
let helper = require('./helper');
let passportLocalMongoose = require('passport-local-mongoose');
let schema = helper.schema({
    nickname: String,
    createTime: Number,
    workMail: String,
    groupId: String
}, {
    ignores: ['salt', 'hash']
});

schema.set('collection', 'users');
schema.plugin(passportLocalMongoose);
module.exports = helper.model('User', schema);