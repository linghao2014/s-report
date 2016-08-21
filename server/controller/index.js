'use strict';
const userController = require('./user');

module.exports.initialize = function(app) {
    app.use(userController.routes());
};