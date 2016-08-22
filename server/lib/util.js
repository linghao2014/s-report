/**
 * 工具方法
 */
'use strict';
const config = require('../config');
const mailer = require('nodemailer');
const crypto = require('crypto');
const transporter = mailer.createTransport(config.mail);
const logger = require('./logger');
const skey = 'bLiXoEdDlsOiDl';// TODO 不要代码里写死

module.exports.sendMail = function (mail) {
    let user = config.mail.auth.user;
    !mail.from && (mail.from = `"简报" <${user}>`);
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mail, err => {
            if (err) {
                reject(err);
                logger.warn('邮件发送失败', err);
            } else {
                resolve();
            }
        });
    });
};

module.exports.encrypt = function (clear) {
    let cipher = crypto.createCipher('aes192', skey);
    let encrypted = cipher.update(JSON.stringify(clear), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

module.exports.decrypt = function (encrypted) {
    let decipher = crypto.createDecipher('aes192', skey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports.isMail = function (str) {
    return /^\w+@\w+/.test(str);
};