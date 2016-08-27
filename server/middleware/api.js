/**
 * api middleware
 */
'use strict';
const _ = require('lodash');
const User = require('../model/user');
const Group = require('../model/group');
const logger = require('../lib/logger');
module.exports.errorToJson = function () {
    return function*(next) {
        if (this.request.url.startsWith('/api')) {
            try {
                yield* next;
            } catch (e) {
                this.body = {code: 500};
                logger.error(e);
            } finally {
                if (this.response.status == 404) {
                    this.response.status = 200;
                    this.body = {code: 404};
                } else if (this.response.status == 500) {
                    this.response.status = 200;
                    this.body = {code: 500};
                }
            }
        } else {
            if (this.state.userId) {
                var user = yield User.findById(this.state.userId).exec();
                user = user.toObject();
                if (user.groupId) {
                    let group = yield Group.findById(user.groupId);
                    user.groupAdmin = _.findIndex(group.members, {userId: user.id, admin: true}) > -1;
                }

            }
            yield this.render('index', {user: JSON.stringify(user || {})});
        }

    }
};